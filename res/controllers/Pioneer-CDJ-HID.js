//
// Pioneer CDJ cd player HID script v1.1
// Copyright (C) 2012-2104, Ilkka Tuohela, Sean M. Pappalardo
//
// For Mixxx version 1.11.x and 1.12.x
//

function PioneerCDJController() {
    this.controller = new HIDController();

    // If the decks is showing 'remaining time' on screen
    this.remain_mode = true;

    // LEDs are controlled as bitmask fields
    this.controller.LEDColors = { on:1, off:0 };

    // Active deck is selected with eject button and shown in track number field
    this.controller.activeDeck = 1;

    // Map beatloop sizes to actual mixxx values
    this.beatLoopSizeMap = {
        beatloop_2:  "16", beatloop_2_shift:  "1",      beatloop_2_hotcue:  "4",
        beatloop_4:  "8",  beatloop_4_shift:  "0.5",    beatloop_4_hotcue:  "3",
        beatloop_8:  "4",  beatloop_8_shift:  "0.25",   beatloop_8_hotcue:  "2",
        beatloop_16: "2",  beatloop_16_shift: "0.125",  beatloop_16_hotcue: "1",
    }

}

PioneerCDJHID = new PioneerCDJController();

PioneerCDJHID.registerInputPackets = function() {
    var controller = PioneerCDJHID.controller;
    var packet = undefined;
    var name = undefined;
    var offset = 0;

    // Data is input with one 20 byte packet, no header
    packet = new HIDPacket("control", [], 20);
    packet.addControl("hid", "eject",          0, "B", 0x1);
    packet.addControl("hid", "previous_track", 0, "B", 0x4);
    packet.addControl("hid", "next_track",     0, "B", 0x8);
    packet.addControl("hid", "seek_back",      0, "B", 0x10);
    packet.addControl("hid", "seek_forward",   0, "B", 0x20);
    packet.addControl("hid", "cue",            0, "B", 0x40);
    packet.addControl("hid", "play",           0, "B", 0x80);

    packet.addControl("hid", "reloop_exit",    1, "B", 0x20);
    packet.addControl("hid", "cue_out",        1, "B", 0x40);
    packet.addControl("hid", "cue_in",         1, "B", 0x80);

    packet.addControl("hid", "time_mode",      2, "B", 0x8);
    packet.addControl("hid", "cue_delete",     2, "B", 0x10);
    packet.addControl("hid", "cue_previous",   2, "B", 0x20);
    packet.addControl("hid", "cue_next",       2, "B", 0x40);
    packet.addControl("hid", "cue_memory",     2, "B", 0x80);

    packet.addControl("hid", "jog_mode",       3, "B", 0x2);
    packet.addControl("hid", "tempo_reset",    3, "B", 0x4);
    packet.addControl("hid", "master_tempo",   3, "B", 0x8);
    packet.addControl("hid", "tempo_range",    3, "B", 0x10);
    packet.addControl("hid", "browse_press",   3, "B", 0x20);
    packet.addControl("hid", "menu_back",      3, "B", 0x40);

    packet.addControl("hid", "beat_select",    4, "B", 0x8);
    packet.addControl("hid", "beatloop_16",    4, "B", 0x10);
    packet.addControl("hid", "beatloop_8",     4, "B", 0x20);
    packet.addControl("hid", "beatloop_4",     4, "B", 0x40);
    packet.addControl("hid", "beatloop_2",     4, "B", 0x80);

    packet.addControl("hid", "hotcue_rec",     5, "B", 0x1);
    packet.addControl("hid", "hotcue_3",       5, "B", 0x20);
    packet.addControl("hid", "hotcue_2",       5, "B", 0x40);
    packet.addControl("hid", "hotcue_1",       5, "B", 0x80);

    packet.addControl("hid", "tag_track",      6, "B", 0x1);
    packet.addControl("hid", "lock_unlock",    6, "B", 0x40);
    packet.addControl("hid", "browse_taglist", 6, "B", 0x80);

    packet.addControl("hid", "reverse",        7, "B", 0x1);
    packet.addControl("hid", "jog_touch",      7, "B", 0x20);
    packet.addControl("hid", "jog_direction",  7, "B", 0x40);
    packet.addControl("hid", "jog_move",       7, "B", 0x80);

    packet.addControl("hid", "vinyl_speed_knob",   8,  "B");
    packet.addControl("hid", "release_start_knob", 9,  "B");
    packet.addControl("hid", "browse_knob",        10, "H", undefined, true);
    packet.addControl("hid", "pitch_slider",       12, "h" );
    packet.addControl("hid", "jog_wheel",          14, "h", undefined, true);
    packet.addControl("hid", "needle_search",      18, "h");

    controller.registerInputPacket(packet);

}

// Register output packets we send to the controller
PioneerCDJHID.registerOutputPackets = function() {
    var controller = PioneerCDJHID.controller;

    var packet = undefined;
    var name = undefined;
    var offset = 0;

    // Control packet for button Outputs
    packet = new HIDPacket("lights", [0x1], 0x20);
    packet.addOutput("hid", "screen_acue",          4, "B", 0x1);
    packet.addOutput("hid", "remain",               4, "B", 0x2);
    packet.addOutput("hid", "reloop_exit",          4, "B", 0x8);
    packet.addOutput("hid", "cue_out",              4, "B", 0x10);
    packet.addOutput("hid", "cue_in",               4, "B", 0x20);
    packet.addOutput("hid", "cue",                  4, "B", 0x40);
    packet.addOutput("hid", "play",                 4, "B", 0x80);

    packet.addOutput("hid", "screen_memory",        5, "B", 0x1);
    packet.addOutput("hid", "screen_wide",          5, "B", 0x8);
    packet.addOutput("hid", "screen_16_percent",    5, "B", 0x10);
    packet.addOutput("hid", "screen_10_percent",    5, "B", 0x20);
    packet.addOutput("hid", "screen_6_percent",     5, "B", 0x40);
    packet.addOutput("hid", "master_tempo",         5, "B", 0x80);

    packet.addOutput("hid", "beatloop_16",          6, "B", 0x1);
    packet.addOutput("hid", "beatloop_8",           6, "B", 0x2);
    packet.addOutput("hid", "beatloop_4",           6, "B", 0x4);
    packet.addOutput("hid", "beatloop_2",           6, "B", 0x8);
    packet.addOutput("hid", "reverse",              6, "B", 0x10);
    packet.addOutput("hid", "jog_dashed_circle",    6, "B", 0x20);
    packet.addOutput("hid", "jog_mode",             6, "B", 0x40);
    packet.addOutput("hid", "jog_mode",             6, "B", 0x80);

    packet.addOutput("hid", "jog_touch_highlight",  7, "B", 0x1);
    packet.addOutput("hid", "hotcue_3_green",       7, "B", 0x4);
    packet.addOutput("hid", "hotcue_3_red",         7, "B", 0x8);
    packet.addOutput("hid", "hotcue_2_green",       7, "B", 0x10);
    packet.addOutput("hid", "hotcue_2_red",         7, "B", 0x20);
    packet.addOutput("hid", "hotcue_1_green",       7, "B", 0x40);
    packet.addOutput("hid", "hotcue_1_red",         7, "B", 0x80);

    packet.addOutput("hid", "browse",               8, "B", 0x1);
    packet.addOutput("hid", "info",                 8, "B", 0x4);
    packet.addOutput("hid", "menu",                 8, "B", 0x40);
    packet.addOutput("hid", "taglist",              8, "B", 0x80);

    packet.addOutput("hid", "screen_flags",         11, "B");
    packet.addOutput("hid", "time_minutes",         12, "B");
    packet.addOutput("hid", "time_seconds",         13, "B");
    packet.addOutput("hid", "time_frames",          14, "B");
    packet.addOutput("hid", "wave_summary_1",       15, "B");
    packet.addOutput("hid", "wave_summary_2",       16, "B");
    packet.addOutput("hid", "wave_summary_3",       17, "B");
    packet.addOutput("hid", "tracknumber",          18, "B");
    packet.addOutput("hid", "bpm",                  20, "H");
    packet.addOutput("hid", "rate",                 22, "h");
    PioneerCDJHID.controller.registerOutputPacket(packet);

    // Control packet to initialize HID mode on CDJ.
    //
    // Basically sending any packet with a 0x1 header seems to set the
    // decks to HID mode, regardless of packet size. Let's use 0x20
    // because it's used for messages above
    packet = new HIDPacket("request_hid_mode", [0x1], 0x20);
    packet.addControl("hid", "mode", 0, "B", 1);
    PioneerCDJHID.controller.registerOutputPacket(packet);

}

PioneerCDJHID.init = function(id) {
    // Mangle ID provided from mixxx
    id = id.replace(/(^\s*)|(\s*$)/gi, "");
    id = id.replace(/[ ]{2,}/gi, " ");
    id = id.replace(/\n /, "\n");
    PioneerCDJHID.id = id;

    var controller = PioneerCDJHID.controller;

    PioneerCDJHID.registerInputPackets();
    PioneerCDJHID.registerOutputPackets();

    // Set HID mode
    var packet = controller.OutputPackets["request_hid_mode"];
    if (packet != undefined) {
        packet.send();
    }

    // Link controls and register callbacks
    PioneerCDJHID.registerCallbacks();

    // Offset of play position, when 'previous track' will seek to
    // beginning of track instead of jumping to previous track
    PioneerCDJHID.previousJumpStartSeconds = 0;

    // Scratch parameters
    controller.scratchintervalsPerRev = 2048;
    controller.scratchAlpha = 1.0 / 6;
    controller.rampedScratchEnable = false;
    controller.toggleButtons = [ "play", "quantize", "keylock", "pfl" ];

    // Reset screen contents
    controller.setOutput("hid", "screen_memory",  0);
    controller.setOutput("hid", "screen_wide",    0);
    controller.setOutput("hid", "jog_mode",       0);

    //tracknumber frames/ms control 0x1
    //rate control                  0x10
    //bpm control                   0x20
    //tracknumber control           0x40
    //jog control                   0x80
    if ( PioneerCDJHID.id == "PIONEER CDJ-900" ||
         PioneerCDJHID.id == "PIONEER CDJ-2000") {
        controller.setOutput("hid", "screen_flags", 0x1|0x2|0x4|0x8|0x10|0x20|0x40|0x80);
    } else if ( PioneerCDJHID.id=="PIONEER CDJ-850") {
        controller.setOutput("hid", "screen_flags", 0x1|0x10|0x20|0x40|0x80);
    } else {
        HIDDebug("Unsupported CDJ device name: " +  PioneerCDJHID.id);
    }

    // Set deck switch local callbacks
    controller.disconnectDeck = PioneerCDJHID.disconnectDeck;
    controller.connectDeck = PioneerCDJHID.connectDeck;
    PioneerCDJHID.connectDeck();


    // Must be set here, because timer namespace is not controller
    controller.startAutoRepeatTimer = function(timer_id, interval) {
        if (controller.timers[timer_id])
            return;
        controller.timers[timer_id] = engine.beginTimer(
            interval,
            "PioneerCDJHID.controller.autorepeatTimer()"
        )
    }

    HIDDebug("Pioneer CDJ Deck " + PioneerCDJHID.id + " initialized");
}

// Device cleanup function
PioneerCDJHID.shutdown = function() {
    HIDDebug("Pioneer CDJ Deck " + PioneerCDJHID.id + " shutdown");
}

// Mandatory default handler for incoming packets
PioneerCDJHID.incomingData = function(data, length) {
    PioneerCDJHID.controller.parsePacket(data, length);
}

// Jog wheel seek event scaler
PioneerCDJHID.jogScaler = function(group, name, value) {
    return value / 12;
}

// Pitch on CDJ sends -1000 to 1000, reset at 0, swap direction
PioneerCDJHID.pitchScaler = function(group, name, value) {
    return - (value / 1000);
}

// Jog wheel scratch event (ticks) scaler
PioneerCDJHID.jogPositionDeltaScaler = function(group, name, value) {
    // We sometimes receive invalid events with value > 32000, ignore those
    if (value>=8192) {
        return 0;
    }
    return value / 3;
}

// Link virtual HID naming of input and Output controls to mixxx
PioneerCDJHID.registerCallbacks = function() {
    var controller = PioneerCDJHID.controller;

    controller.enableScratchCallback = PioneerCDJHID.enableScratchCallback;

    // Play/cue/reverse buttons
    controller.linkControl("hid", "play",         "deck", "play");
    controller.linkControl("hid", "cue",          "deck", "cue_default");
    controller.linkControl("hid", "reverse",      "deck", "reverse");
    controller.linkControl("hid", "seek_back",    "deck", "back");
    controller.linkControl("hid", "seek_forward", "deck", "fwd");

    controller.setCallback("control", "hid", "previous_track", PioneerCDJHID.trackChangeCallback);
    controller.setCallback("control", "hid", "next_track",     PioneerCDJHID.trackChangeCallback);
    controller.setAutoRepeat("hid", "previous_track", PioneerCDJHID.trackChangeCallback, 200);
    controller.setAutoRepeat("hid", "next_track", PioneerCDJHID.trackChangeCallback, 200);

    controller.setCallback("control", "hid", "tempo_reset",    PioneerCDJHID.resetRateCallback);
    controller.setCallback("control", "hid", "reloop_exit",    PioneerCDJHID.reloopExitCallback);
    controller.setCallback("control", "hid", "needle_search",  PioneerCDJHID.needlesearchCallback);

    // Knob to browse tracks on right of screen
    controller.linkControl("hid", "browse_press", "deck",       "LoadSelectedTrack");
    controller.linkControl("hid", "browse_knob",  "[Playlist]", "SelectTrackKnob");

    // Pitch slider is range -1000..0..1000
    controller.linkControl("hid", "pitch_slider", "deck", "rate");
    controller.setScaler("rate", PioneerCDJHID.pitchScaler);

    // Loop in/out buttons, loop exit button
    controller.linkControl("hid", "cue_in",  "deck", "loop_in");
    controller.linkControl("hid", "cue_out", "deck", "loop_out");

    // Handle beatloop buttons with modifier + callback
    controller.linkModifier("hid", "beat_select", "beatloop_size");
    controller.linkModifier("hid", "hotcue_rec",  "hotcue_rec");
    controller.linkModifier("hid", "cue_memory",  "hotcue_set");
    controller.linkModifier("hid", "cue_delete",  "hotcue_delete");

    // LEDs for hotcues and beatloop are controlled by the callback
    controller.setCallback("control", "hid", "hotcue_1",    PioneerCDJHID.hotcueCallback);
    controller.setCallback("control", "hid", "hotcue_2",    PioneerCDJHID.hotcueCallback);
    controller.setCallback("control", "hid", "hotcue_3",    PioneerCDJHID.hotcueCallback);
    controller.setCallback("control", "hid", "beatloop_16", PioneerCDJHID.beatloopCallback);
    controller.setCallback("control", "hid", "beatloop_8",  PioneerCDJHID.beatloopCallback);
    controller.setCallback("control", "hid", "beatloop_4",  PioneerCDJHID.beatloopCallback);
    controller.setCallback("control", "hid", "beatloop_2",  PioneerCDJHID.beatloopCallback);
    controller.setCallback("control", "hid", "time_mode",   PioneerCDJHID.timeModeCallback);

    // Link jog touch and delta to default jog and scratch functions.
    controller.linkControl("hid", "jog_touch", "deck", "jog_touch");
    controller.linkControl("hid", "jog_wheel", "deck", "jog_wheel");
    // Standard HIDController scalers for jog functionality.
    controller.setScaler("jog",         PioneerCDJHID.jogScaler);
    controller.setScaler("jog_scratch", PioneerCDJHID.jogPositionDeltaScaler);

    // Misuse some buttons for something more useful in mixxx
    controller.linkControl("hid", "cue_previous", "deck", "loop_halve");
    controller.linkControl("hid", "cue_next",     "deck", "loop_double");
    controller.linkControl("hid", "master_tempo", "deck", "beatsync");
    controller.linkControl("hid", "tempo_range",  "deck", "beats_translate_curpos");
    controller.linkControl("hid", "jog_mode",     "deck", "pfl");

    // Output fields for mixxx state changes
    controller.linkOutput("hid", "play",    "deck", "play",        "PioneerCDJHID.updateLED");
    controller.linkOutput("hid", "cue",     "deck", "cue_default", "PioneerCDJHID.updateLED");
    controller.linkOutput("hid", "reverse", "deck", "reverse",     "PioneerCDJHID.updateLED");
    controller.linkOutput("hid", "cue_in",  "deck", "loop_in",     "PioneerCDJHID.updateLED");
    controller.linkOutput("hid", "cue_out", "deck", "loop_out",    "PioneerCDJHID.updateLED");
    controller.linkOutput("hid", "bpm",     "deck", "bpm",         "PioneerCDJHID.bpmCallback");
    controller.linkOutput("hid", "rate",    "deck", "rate",        "PioneerCDJHID.rateCallback");

    // Use 'eject' button for deck switching
    controller.setCallback("control", "hid", "menu_back",        PioneerCDJHID.switchDeck);

    // Unused buttons
    controller.setCallback("control", "hid", "eject",            PioneerCDJHID.unmappedCallback);
    controller.setCallback("control", "hid", "jog_direction",    PioneerCDJHID.unmappedCallback);
    controller.setCallback("control", "hid", "jog_move",         PioneerCDJHID.unmappedCallback);
    controller.setCallback("control", "hid", "tag_track",        PioneerCDJHID.unmappedCallback);
    controller.setCallback("control", "hid", "vinyl_speed_knob", PioneerCDJHID.unmappedCallback);

}

// Callback to update LEDs from engine.connectControl
PioneerCDJHID.updateLED = function(value, group, key) {
    var controller = PioneerCDJHID.controller;
    if (value==1) {
        controller.setOutput("deck", key, controller.LEDColors.on, true);
    } else {
        controller.setOutput("deck", key, controller.LEDColors.off, true);
    }
}

// Switch active deck between 1 and 2
PioneerCDJHID.switchDeck = function(field) {
    var controller = PioneerCDJHID.controller;
    if (field.value == controller.buttonStates.released) {
        return;
    }
    controller.switchDeck();
    HIDDebug(PioneerCDJHID.id + " active  deck now " + controller.activeDeck);
}

// Disconnect controls before deck during deck switching
PioneerCDJHID.disconnectDeck = function() {
    var controller = PioneerCDJHID.controller;
    var group = controller.resolveDeckGroup(controller.activeDeck);
    engine.connectControl(group, "duration",     "PioneerCDJHID.durationCallback", true);
    engine.connectControl(group, "playposition", "PioneerCDJHID.positionCallback", true);
}

// Connect controls during init and after deck during deck switching
PioneerCDJHID.connectDeck = function() {
    var controller = PioneerCDJHID.controller;
    var group = controller.resolveDeckGroup(controller.activeDeck);
    var output_packet = controller.getOutputPacket("lights");

    engine.connectControl(group, "duration",     "PioneerCDJHID.durationCallback");
    engine.connectControl(group, "playposition", "PioneerCDJHID.positionCallback");

    if (PioneerCDJHID.remain_mode) {
        controller.setOutput("hid", "remain", 1);
    } else {
        controller.setOutput("hid", "remain", 0);
    }

    // Note - we set these in one go and send one packet in the end
    PioneerCDJHID.setBPMDisplay();
    PioneerCDJHID.setRateDisplay();
    PioneerCDJHID.setTrackDuration();
    PioneerCDJHID.setTimeDisplay();
    controller.setOutput("hid", "tracknumber", controller.activeDeck);

    // Sent the updated state to controller
    output_packet.send();
}

// Set internal track duration variable
PioneerCDJHID.setTrackDuration = function(value) {
    var controller = PioneerCDJHID.controller;
    var group = controller.resolveDeckGroup(controller.activeDeck);
    if (value == undefined) {
        PioneerCDJHID.track_length = engine.getValue(group, "duration");
    } else {
        PioneerCDJHID.track_length = value;
    }
}

// Set BPM to for display on controller
PioneerCDJHID.setBPMDisplay = function(value) {
    var controller = PioneerCDJHID.controller;
    var group = controller.resolveDeckGroup(controller.activeDeck);
    controller.setOutput("deck", "bpm", Math.floor(engine.getValue(group, "bpm")));
}

// Set rate for display on controller
PioneerCDJHID.setRateDisplay = function(value) {
    var controller = PioneerCDJHID.controller;
    var group = controller.resolveDeckGroup(controller.activeDeck);

    // Multiply actual rate with 100
    var range = Math.floor(100 * engine.getValue(group, "rateRange"));
    var value = 100 * range * engine.getValue(group, "rate_dir") * engine.getValue(group, "rate");
    controller.setOutput("hid", "rate", value);
}

// Set current time for track on controller
//
// As a side effect this enables the spinning deck animations in firmware. Yes it's weird :)
//
PioneerCDJHID.setTimeDisplay = function(value) {
    var minutes, seconds, frames;
    var controller = PioneerCDJHID.controller;
    var group = controller.resolveDeckGroup(controller.activeDeck);

    if (value == undefined) {
        value = engine.getValue(group, "playposition");
    }

    if (PioneerCDJHID.id == "PIONEER CDJ-850") {
        if (PioneerCDJHID.remain_mode == true) {
            if (value >= 1.0) {
                minutes = 0x76;
                seconds = 0x8d;
                frames  = 0x80;
            } else {
                position = PioneerCDJHID.track_length - PioneerCDJHID.track_length * value;
                minutes = Math.floor( 0x77 - (position / 60) );
                seconds = Math.floor( 0x8d - (position % 60) );
                frames =  0x79 - Math.floor( ( position - Math.floor(position) ) * 100);
            }
        } else {
            if (value <= 0) {
                position = 0;
                minutes = 0;
                seconds = 0;
                frames = 0;
            } else {
                position = PioneerCDJHID.track_length * value;
                minutes = Math.floor( position / 60);
                seconds = Math.floor( position % 60);
                frames  = Math.floor( (position - Math.floor(position) ) * 100);
            }
        }
        controller.setOutput("hid","time_minutes", minutes);
        controller.setOutput("hid","time_seconds", seconds);
        controller.setOutput("hid","time_frames",  frames);

    } else if (PioneerCDJHID.id == "PIONEER CDJ-900" ||
               PioneerCDJHID.id == "PIONEER CDJ-2000") {

        if (PioneerCDJHID.remain_mode == true) {
            controller.setOutput("hid", "wave_summary_1", 0x80);
            controller.setOutput("hid", "wave_summary_2", 0x20);
            controller.setOutput("hid", "wave_summary_3", 0x10);

            if (value >= 1) {
                minutes = 0x74;
                seconds = 0x8d;
                frames = 0x79;
            } else {
                position = PioneerCDJHID.track_length - PioneerCDJHID.track_length * value;
                minutes = Math.floor( 0x77 - (position / 60) );
                seconds = Math.floor( 0x8d - (position % 60) );
                frames  = 0x79 - Math.floor( (position - Math.floor(position) ) * 100);
            }
            controller.setOutput("hid", "wave_summary_1", 0x76);
            controller.setOutput("hid", "wave_summary_2", 0x8d);
            controller.setOutput("hid", "wave_summary_3", 0x79);

        } else {
            controller.setOutput("hid", "wave_summary_1", 0);
            controller.setOutput("hid", "wave_summary_2", 0);
            controller.setOutput("hid", "wave_summary_3", 0);
            if (value <= 0) {
                minutes = 0;
                seconds = 0;
                frames = 0;
            } else {
                position = PioneerCDJHID.track_length * value;
                minutes = Math.floor(position / 60);
                seconds = Math.floor(position % 60);
                frames  = Math.floor( ( position - Math.floor(position) ) * 100);
            }
        }

        controller.setOutput("hid", "time_minutes", minutes);
        controller.setOutput("hid", "time_seconds", seconds);
        controller.setOutput("hid", "time_frames",  frames);

    }
}

// Enable or disable scratch mode
PioneerCDJHID.enableScratchCallback = function(value) {
    var controller = PioneerCDJHID.controller;
    controller.setOutput("hid","jog_touch_highlight", value);
}

// Adjust pregain
PioneerCDJHID.pregainCallback = function(field) {
    var controller = PioneerCDJHID.controller;
    var group = controller.resolveDeckGroup(controller.activeDeck);
    engine.setValue(group, "pregain", script.absoluteNonLin(field.value, 0, 1, 5, 0, 65536)
    );
}

// Toggle CDJ 'remain/elapsed' track display mode
PioneerCDJHID.timeModeCallback = function(field) {
    var output_packet = PioneerCDJHID.controller.getOutputPacket("lights");
    var controller = PioneerCDJHID.controller;

    if (field.value == controller.buttonStates.released) {
        return;
    }

    PioneerCDJHID.remain_mode = (PioneerCDJHID.remain_mode != true) ? true : false;

    if (PioneerCDJHID.remain_mode) {
        controller.setOutput("hid", "remain", 1);
    } else {
        controller.setOutput("hid", "remain", 0);
    }
    PioneerCDJHID.setTimeDisplay();
    output_packet.send();
}

// Control callback when track duration changes (new track is loaded)
// Update all other outputs as side effect
PioneerCDJHID.durationCallback = function(value, group, key) {
    var output_packet = PioneerCDJHID.controller.getOutputPacket("lights");
    PioneerCDJHID.setTrackDuration(value);
    PioneerCDJHID.setBPMDisplay();
    PioneerCDJHID.setRateDisplay();
    PioneerCDJHID.setTimeDisplay(value);
    output_packet.send();
}

// Control callback to update track position value
PioneerCDJHID.positionCallback = function(value, group, key) {
    var output_packet = PioneerCDJHID.controller.getOutputPacket("lights");
    PioneerCDJHID.setTimeDisplay(value);
    output_packet.send();
}

// Control callback to update track BPM value
PioneerCDJHID.bpmCallback = function(value) {
    var output_packet = PioneerCDJHID.controller.getOutputPacket("lights");
    PioneerCDJHID.setBPMDisplay(value);
    output_packet.send();
}

// Control callback to update track rate value
PioneerCDJHID.rateCallback = function(value) {
    var output_packet = PioneerCDJHID.controller.getOutputPacket("lights");
    PioneerCDJHID.setRateDisplay(value);
    output_packet.send();
}

// HID callback for previous/next track buttons.
PioneerCDJHID.trackChangeCallback = function(field) {
    var controller = PioneerCDJHID.controller;
    var group = controller.resolveDeckGroup(controller.activeDeck);

    if (field.value == controller.buttonStates.released) {
        return;
    }

    if (field.name == 'previous_track') {
        engine.setValue("[Playlist]", "SelectPrevTrack", true);
    } else if (field.name == 'next_track') {
        engine.setValue("[Playlist]", "SelectNextTrack", true);
    } else {
        HIDDebug("track: Unknown track control field " + field.id);
        return;
    }
}

// Seek to position with 'needle search' on CDJ-2000
PioneerCDJHID.needlesearchCallback = function(field) {
    var controller = PioneerCDJHID.controller;
    var group = controller.resolveDeckGroup(controller.activeDeck);
    var value = field.value / 400;
    if (value == 0) {
        return;
    }
    engine.setValue(group, "play", false);
    engine.setValue(group, "playposition", value);

}

// CDJ-2000 hotcue buttons
PioneerCDJHID.hotcueCallback = function(field) {
    var controller = PioneerCDJHID.controller;
    var group = controller.resolveDeckGroup(controller.activeDeck);
    var control;

    if (field.value == controller.buttonStates.released) {
        controller.setOutput("hid", field.name+"_red", 0);
        return;
    }

    if (controller.modifiers.get("hotcue_delete")) {
        control = field.name + '_activate';
        controller.setOutput("hid", field.name+"_red",   0);
        controller.setOutput("hid", field.name+"_green", 0);
        control = field.name + '_clear';

    } else if (controller.modifiers.get("hotcue_rec")) {
        control = field.name + '_set';
        controller.setOutput("hid", field.name+"_red",   1);
        controller.setOutput("hid", field.name+"_green", 1);

    } else {
        control = field.name + '_activate';
        controller.setOutput("hid", field.name+"_red",   0);
        controller.setOutput("hid", field.name+"_green", 1);
    }
    engine.setValue(group, control, true);
}

// Set given size beatloop or a hotcue, light LED for beatloop
PioneerCDJHID.beatloopCallback = function(field) {
    var controller = PioneerCDJHID.controller;
    var group = controller.resolveDeckGroup(controller.activeDeck);
    var size;

    if (field.value == controller.buttonStates.released) {
        return;
    }

    if (controller.modifiers.get("hotcue_set")) {
        size = PioneerCDJHID.beatLoopSizeMap[field.name + "_hotcue"];
        control = "hotcue_" + size + "_activate";
    } else if (controller.modifiers.get("hotcue_delete")) {
        size = PioneerCDJHID.beatLoopSizeMap[field.name + "_hotcue"];
        control = "hotcue_" + size + "_clear";
    } else if (controller.modifiers.get("beatloop_size")) {
        size = PioneerCDJHID.beatLoopSizeMap[field.name + "_shift"] ;
        control = "beatloop_" + size + "_activate";
        engine.setValue(group, control, true);
    } else {
        size = PioneerCDJHID.beatLoopSizeMap[field.name];
        control = "beatloop_" + size + "_activate";
    }
    engine.setValue(group, control, true);

    var output_packet = controller.getOutputPacket("lights");
    controller.setOutput("hid", "beatloop_16", controller.LEDColors.off);
    controller.setOutput("hid", "beatloop_8",  controller.LEDColors.off);
    controller.setOutput("hid", "beatloop_4",  controller.LEDColors.off);
    controller.setOutput("hid", "beatloop_2",  controller.LEDColors.off);
    controller.setOutput("hid", field.name, controller.LEDColors.on);
    output_packet.send();

}

// Exit current beatloop or manual loop, reset beatloop LEDs
PioneerCDJHID.reloopExitCallback = function(field) {
    var controller = PioneerCDJHID.controller;
    var group = controller.resolveDeckGroup(controller.activeDeck);

    if (field.value == controller.buttonStates.released) {
        controller.setOutput("hid", field.name, controller.LEDColors.off);
        return;
    }

    engine.setValue(group, "reloop_exit", true);

    var output_packet = controller.getOutputPacket("lights");
    controller.setOutput("hid", "beatloop_16", controller.LEDColors.off);
    controller.setOutput("hid", "beatloop_8",  controller.LEDColors.off);
    controller.setOutput("hid", "beatloop_4",  controller.LEDColors.off);
    controller.setOutput("hid", "beatloop_2",  controller.LEDColors.off);
    controller.setOutput("hid", field.name, controller.LEDColors.on);
    output_packet.send();
}

PioneerCDJHID.resetRateCallback = function(field) {
    var controller = PioneerCDJHID.controller;
    var group = controller.resolveDeckGroup(controller.activeDeck);
    engine.setValue(group, "rate", 0);
}

PioneerCDJHID.unmappedCallback = function(field) {
}

