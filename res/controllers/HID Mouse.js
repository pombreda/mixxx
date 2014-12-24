
function HIDMouseController() {
    this.controller = new HIDController();

    this.init = function(id) {
        this.id = id;

        this.registerInputPackets();
        this.registerOutputPackets();
        this.registerScalers();
        this.registerCallbacks();

        HIDDebug("HID mouse initialized: " + this.id);
    }

    this.shutdown = function() {
        HIDDebug("HID mouse shutdown: " + this.id);
    }

}

HIDMouse = new HIDMouseController();

HIDMouse.registerInputPackets = function() {
    packet = new HIDPacket("control", [0x2], 7);
    packet.addControl("buttons", "1", 1, "B", 0x1);
    packet.addControl("buttons", "2", 1, "B", 0x2);
    packet.addControl("buttons", "3", 1, "B", 0x4);
    packet.addControl("buttons", "4", 1, "B", 0x8);
    packet.addControl("buttons", "5", 1, "B", 0xf);
    packet.addControl("direction", "x", 2, "B");
    packet.addControl("direction", "y", 3, "B");
    packet.addControl("scroll", "wheel", 5, "B");
    HIDMouse.controller.registerInputPacket(packet);
}

HIDMouse.registerOutputPackets = function() {
}

HIDMouse.registerScalers = function() {
}

HIDMouse.registerCallbacks = function() {
    var controller = HIDMouse.controller;

    controller.setCallback("control", "buttons", "1", HIDMouse.mouseButton);
    controller.setCallback("control", "buttons", "2", HIDMouse.mouseButton);
    controller.setCallback("control", "direction", "x", HIDMouse.mousePosition);
    controller.setCallback("control", "direction", "y", HIDMouse.Position);
    controller.setCallback("control", "scroll", "wheel", HIDMouse.mouseScroll);

}

HIDMouse.incomingData = function(data, length) {
    var controller = HIDMouse.controller;

    if (controller==undefined) {
        HIDDebug("Error in script initialization: controller not found");
        return;
    }

    controller.parsePacket(data, length);

}

HIDMouse.mouseButton = function(field) {
    HIDDebug("mouse button" + field.id + " value " + field.value);
}

HIDMouse.mousePosition = function(field) {
    HIDDebug("mouse position" + field.id + " value " + field.value);
}

HIDMouse.mouseScroll = function(field) {
    HIDDebug("mouse scroll" + field.id + " value " + field.value);
}
