#!/bin/python
import os
import sys

class Remote:
    def __init__(self, uid1, uid2, uid3, unit):
	    self.uid1 = str(uid1).zfill(2)
	    self.uid2 = str(uid2).zfill(2)
	    self.uid3 = str(uid3).zfill(2)
	    self.unit = str(unit).zfill(2)

SIGNAL_STENGTH = "0F"
  
cmds = {
    "MY": "00",
    "UP": "01",
    "DOWN": "03",
}

def send_rfx_cmd(cmd):
    print cmd
    #verbose:
    #os.system('rfxcmd_gc-0.3-beta.1/rfxcmd.py -v -s "%s"' % cmd)
    return os.system('rfxcmd_gc-0.3-beta.1/rfxcmd.py  -d /dev/USBrfxcom -s "%s"' % cmd) == 0

def send_somfy_cmd(remote_name, cmd):
    if remote_name == "ALL":
        for remote in remotes.keys():
            while not send_somfy_cmd(remote, cmd):
                pass
        return True
    else:
        remote = remotes[remote_name]
        cmd_string = "0C 1A 00 00 %s %s %s %s %s 00 00 00 %s" % (
            remote.uid1, remote.uid2, remote.uid3, remote.unit,
            cmds[cmd],
            SIGNAL_STENGTH
        )
        return send_rfx_cmd(cmd_string)

remotes = {
    'UP_OUT': Remote(7, 7, 7, 1),
    'KITCHEN1': Remote(7, 7, 8, 1),
    'KITCHEN2': Remote(7, 7, 8, 2),
    'SALON_SMALL': Remote(7, 7, 8, 3),
    'SALON_OUT': Remote(7, 7, 8, 4),
    'PARENTS': Remote(7, 7, 7, 2),
}


if __name__ == "__main__":
    if len(sys.argv) != 3:
        print "Usage:\n%s <remote_name> <command>\n" % sys.argv[0]
    else:
        remote_name = sys.argv[1]
        command_name = sys.argv[2]
        if remote_name not in remotes and remote_name != "ALL":
            print "ERROR: %s isn't a recognized remote name.\n\nWe currently have the following remotes configured:\n%s" % (remote_name, remotes.keys())
        elif command_name not in cmds:
            print "ERROR: %s isn't a recognized command name.\n\nWe have the following commands:\n%s" % (command_name, cmds.keys())
        else:
            print send_somfy_cmd(sys.argv[1], sys.argv[2])
    #send_somfy_cmd("KITCHEN1", "MY")
    #send_somfy_cmd("KITCHEN2", "MY")
    #send_somfy_cmd("SALON_SMALL", "MY")
    #send_somfy_cmd("SALON_OUT", "DOWN")
    #send_somfy_cmd("PARENTS", "MY")
    # print send_somfy_cmd("UP_OUT", "MY")
