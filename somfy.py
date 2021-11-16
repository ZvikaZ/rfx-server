#!/bin/python
import os
import sys
import time
import logging

import config

logger = logging.getLogger("SOMFY")
logger.setLevel(logging.DEBUG)

file_log_handler = logging.FileHandler('somfy.log')
logger.addHandler(file_log_handler)

stderr_log_handler = logging.StreamHandler()
logger.addHandler(stderr_log_handler)

# nice output format
formatter = logging.Formatter('%(asctime)s [%(name)s] %(levelname)s:%(message)s')
file_log_handler.setFormatter(formatter)
stderr_log_handler.setFormatter(formatter)

  
cmds = {
    "MY": "00",
    "UP": "01",
    "DOWN": "03",
}

def try_few_times(func, *args):
    logger.debug("try_few_times " + str(func) + ", " + str(args))
    MAX_NUM_OF_TRIES = 4
    num_of_tries = 0
    while num_of_tries < MAX_NUM_OF_TRIES:
        num_of_tries += 1
        if func(*args):
            logger.debug("try_few_times: pass")
            return True
    return False

def send_rfx_cmd(cmd):
    logger.debug("send_rfx_cmd: " + cmd)
    #TODO: replace os.system with either subprocess, or even better, direct call to rfxcmd methods
    #os.system('rfxcmd_gc-0.3-beta.1/rfxcmd.py -v -s "%s"' % cmd)
    return os.system('%s %s -d %s -s "%s"' % (
        config.rfxcmd_location,
        "-v" if config.rfxcmd_verbose else "",
        config.rfx_device_port,
        cmd)) == 0

def send_somfy_cmd(remote_name, cmd):
    logger.info("send_somfy_cmd: " + remote_name + ", "+ cmd)
    if remote_name in config.groups:
        result = True
        for remote in config.groups[remote_name]:
            # regular 'AND' operator uses short-circuit-logic, which will stop the 
            # process upon any failure.
            # but I want to continue even then, therefore using the binary '&' bitwise
            result &= try_few_times(send_somfy_cmd, remote, cmd)
        return result
    else:
        if cmd not in cmds:
            return try_few_times(handle_percentage, remote_name, float(cmd))
        else:
            remote = config.remotes[remote_name]
            cmd_string = "0C 1A 00 00 %s %s 00 00 00 %s" % (
                remote.get_id_in_hexa(),    # four bytes
                cmds[cmd],
                config.SIGNAL_STENGTH
            )
            return send_rfx_cmd(cmd_string)

def handle_percentage(remote_name, cmd):
    logger.debug("handle_percentage: going to %d" % cmd)
    remote = config.remotes[remote_name]
    actions = remote.analyze_percent(cmd)
    logger.info("%s - %s : %s" % (remote_name, cmd, actions))
    for action in actions:
        try:
            time_to_wait = float(action) - config.LATENCY
            if time_to_wait < 0:
                time_to_wait = 0
            logger.debug("Waiting %f seconds" % time_to_wait)
            time.sleep(time_to_wait)
        except ValueError:
            logger.debug("Doing %s" % action)
            if not send_somfy_cmd(remote_name, action):
                return False
    return True

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage:\n%s <remote_name> <command>\n" % sys.argv[0])
    else:
        remote_name = sys.argv[1]
        command_name = sys.argv[2]
        if remote_name not in config.remotes and remote_name not in config.groups:
            logger.error("%s isn't a recognized remote name.\n\nWe currently have the following remotes configured:\n%s" % (remote_name, config.remotes.keys()))
        elif not (command_name in cmds or (command_name.isdigit() and 0<=float(command_name)<=100)) :
            logger.error("%s isn't a recognized command name.\n\nWe have the following commands:\n%s\nor any number from 0-100" % (command_name, cmds.keys()))
        else:
            if not send_somfy_cmd(sys.argv[1], sys.argv[2]):
                logger.error("Failed to execute")

    # print send_somfy_cmd("UP_OUT", "MY")
