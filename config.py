from remote import Remote

# from here user can change
LATENCY = 1.0
rfx_device_port = "/dev/USBrfxcom"
rfxcmd_location = "rfxcmd_gc-0.3-beta.1/rfxcmd.py"
rfxcmd_verbose = False

SIGNAL_STENGTH = "0F"

remotes = {
    'UP_OUT': Remote(id=(7, 7, 7, 1)),
#    'KITCHEN1': Remote(7, 7, 8, 1),
#    'KITCHEN2': Remote(7, 7, 8, 2),
#    'SALON_SMALL': Remote(7, 7, 8, 3),
#    'SALON_OUT': Remote(7, 7, 8, 4),
#    'PARENTS': Remote(7, 7, 7, 2),
}
