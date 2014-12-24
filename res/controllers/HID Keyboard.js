
function HIDKeyboardController() {
    this.controller = new HIDController();

    this.init = function(id) {
        this.id = id;

        this.registerInputPackets();
        this.registerCallbacks();

        HIDDebug("HID keyboard initialized: " + this.id);
    }

    this.shutdown = function() {
        HIDDebug("HID keyboard shutdown: " + this.id);
    }

}

HIDKeyboard = new HIDKeyboardController();

HIDKeyboard.registerInputPackets = function() {
    packet = new HIDPacket("control", [0x1,0x0,0x0], 9);
    packet.addControl("keycode", "1", 3, "B");
    packet.addControl("keycode", "2", 4, "B");
    packet.addControl("keycode", "3", 5, "B");
    packet.addControl("keycode", "4", 6, "B");
    packet.addControl("keycode", "5", 7, "B");
    packet.addControl("keycode", "6", 8, "B");
    HIDKeyboard.controller.registerInputPacket(packet);
}

HIDKeyboard.registerCallbacks = function() {
    var controller = HIDKeyboard.controller;

    controller.setCallback("control", "hid", "keycode_1", HIDKeyboard.keyPress);
    controller.setCallback("control", "hid", "keycode_2", HIDKeyboard.keyPress);
    controller.setCallback("control", "hid", "keycode_3", HIDKeyboard.keyPress);
    controller.setCallback("control", "hid", "keycode_4", HIDKeyboard.keyPress);
    controller.setCallback("control", "hid", "keycode_5", HIDKeyboard.keyPress);
    controller.setCallback("control", "hid", "keycode_6", HIDKeyboard.keyPress);

}

HIDKeyboard.incomingData = function(data, length) {
    var controller = HIDKeyboard.controller;

    if (controller==undefined) {
        HIDDebug("Error in script initialization: controller not found");
        return;
    }

    controller.parsePacket(data, length);
}

HIDKeyboard.keyPress = function(field) {
    if (field.value != 0) {
        HIDDebug("KEY PRESS " + field.id + " CODE " + field.value);
    } else {
        HIDDebug("KEY RELEASE " + field.id);
    }
}
