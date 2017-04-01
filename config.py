from remote import Remote

# from here user can change
LATENCY = 1.0
rfx_device_port = "/dev/USBrfxcom"
rfxcmd_location = "/home/zvika/RFXCMD/rfxcmd_gc-0.3-beta.1/rfxcmd.py"
rfxcmd_verbose = False

SIGNAL_STENGTH = "0F"

remotes = {
    'UP_OUT': Remote(id=(7, 7, 7, 1)),
    'KITCHEN1': Remote(id=(7, 7, 8, 1)),
    'KITCHEN2': Remote(id=(7, 7, 8, 2)),
    'SALON_SMALL': Remote(id=(7, 7, 8, 3)),
    'SALON_OUT': Remote(id=(7, 7, 8, 4)),
    'PARENTS': Remote(id=(7, 7, 7, 2)),
}

groups = {
    # 'ALL' is a predefined group, containing - ALL remotes
    'PUBLIC': ['KITCHEN1', 'KITCHEN2', 'SALON_SMALL', 'SALON_OUT'],
    'PUBLIC_SMALL': ['KITCHEN1', 'KITCHEN2', 'SALON_SMALL', ],
}

groups['ALL'] = remotes.keys()
