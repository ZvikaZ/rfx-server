TOP_PERCENT = 0.0
BOTTOM_PERCENT = 100.0

class Remote:
    def __init__(self, id, up_to_my=15.5, my_to_down=7.5, my_percent=90):
        self.id = id
        self.up_to_my = up_to_my
        self.my_to_down = my_to_down
        self.max_time = up_to_my + my_to_down
        self.my_percent = my_percent
        self.middle_percent = my_percent / 2

    def get_id_in_hexa(self):
        return "%02x %02x %02x %02x" % self.id

    def analyze_percent(self, percent):
        if percent == TOP_PERCENT:
            return ("UP",)
        elif percent == BOTTOM_PERCENT:
            return ("DOWN",)
        elif percent == self.my_percent:
            return ("MY",)
        elif TOP_PERCENT < percent <= self.middle_percent:
            time = percent / self.my_percent * self.up_to_my
            return ("UP", self.max_time, "DOWN", time, "MY")
        elif self.middle_percent < percent < self.my_percent:
            time = (self.my_percent - percent) / self.my_percent * self.up_to_my
            return ("MY", max(self.up_to_my, self.my_to_down), "UP", time, "MY")
        else:
            time = (BOTTOM_PERCENT - percent) / self.my_percent * self.my_to_down
            return ("DOWN", max(self.up_to_my, self.my_to_down), "UP", time, "MY")


