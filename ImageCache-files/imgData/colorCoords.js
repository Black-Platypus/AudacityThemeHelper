var colorCoords = [
	{
		"name": "Blank",
		"coords": [1, 762, 10, 771],
		"chartPos": [1, 1],
		"comment": "track background (outside clips), unselected"
	},
	{
		"name": "Unselected",
		"coords": [13, 762, 22, 771],
		"chartPos": [2, 1],
		"comment": "clip (waveform & spectrum) background, unselected - in spectrum bg, a grey tint is superimposed"
	},
	{
		"name": "Selected",
		"coords": [25, 762, 34, 771],
		"chartPos": [3, 1],
		"comment": "selection bg in waveform and spectrum (outside spectral frequency selection) - in spectrum bg, a grey tint is superimposed"
	},
	{
		"name": "Sample",
		"coords": [37, 762, 46, 771],
		"chartPos": [4, 1],
		"comment": "sample & waveform (except RMS)"
	},
	{
		"name": "SelSample",
		"coords": [49, 762, 58, 771],
		"chartPos": [5, 1],
		"comment": "??? (apparently not used)"
	},
	{
		"name": "DragSample",
		"coords": [61, 762, 70, 771],
		"chartPos": [6, 1],
		"comment": "sample dot (when pencil tool enabled)"
	},
	{
		"name": "MuteSample",
		"coords": [73, 762, 82, 771],
		"chartPos": [7, 1],
		"comment": "sample & waveform (except RMS), muted"
	},
	{
		"name": "Rms",
		"coords": [85, 762, 94, 771],
		"chartPos": [8, 1],
		"comment": "waveform (RMS only)"
	},
	{
		"name": "MuteRms",
		"coords": [97, 762, 106, 771],
		"chartPos": [9, 1],
		"comment": "waveform (RMS only), muted"
	},
	{
		"name": "Shadow",
		"coords": [109, 762, 118, 771],
		"chartPos": [10, 1],
		"comment": "???"
	},
	{
		"name": "AboutBackground",
		"coords": [121, 762, 130, 771],
		"chartPos": [11, 1],
		"comment": "\"About\" window bg (external)"
	},
	{
		"name": "TrackPanelText",
		"coords": [133, 762, 142, 771],
		"chartPos": [12, 1],
		"comment": "all texts in track panel, rulers and toolbars; line and ticks of the ruler; track name overlay text and border (when enabled)"
	},
	{
		"name": "LabelTrackText",
		"coords": [145, 762, 154, 771],
		"chartPos": [13, 1],
		"comment": "label tag text; channel numbers in MIDI track info panel"
	},
	{
		"name": "MeterPeak",
		"coords": [157, 762, 166, 771],
		"chartPos": [14, 1],
		"comment": "maximum peak indicator in volume meters"
	},
	{
		"name": "MeterDisabledPen",
		"coords": [169, 762, 178, 771],
		"chartPos": [15, 1],
		"comment": "???"
	},
	{
		"name": "MeterDisabledBrush",
		"coords": [181, 762, 190, 771],
		"chartPos": [16, 1],
		"comment": "???"
	},
	{
		"name": "MeterInputPen",
		"coords": [193, 762, 202, 771],
		"chartPos": [17, 1],
		"comment": "recent peaks in input meter, rms setting"
	},
	{
		"name": "MeterInputBrush",
		"coords": [205, 762, 214, 771],
		"chartPos": [18, 1],
		"comment": "level in input meter, rms setting (except RMS part)"
	},
	{
		"name": "MeterInputRMSBrush",
		"coords": [217, 762, 226, 771],
		"chartPos": [19, 1],
		"comment": "level in input meter, rms setting (RMS part only)"
	},
	{
		"name": "MeterInputClipBrush",
		"coords": [229, 762, 238, 771],
		"chartPos": [20, 1],
		"comment": "clipping indicator in input meter"
	},
	{
		"name": "MeterInputLightPen",
		"coords": [241, 762, 250, 771],
		"chartPos": [21, 1],
		"comment": "???"
	},
	{
		"name": "MeterInputDarkPen",
		"coords": [253, 762, 262, 771],
		"chartPos": [22, 1],
		"comment": "???"
	},
	{
		"name": "MeterOutputPen",
		"coords": [265, 762, 274, 771],
		"chartPos": [23, 1],
		"comment": "recent peaks in output meter, rms setting"
	},
	{
		"name": "MeterOutputBrush",
		"coords": [277, 762, 286, 771],
		"chartPos": [24, 1],
		"comment": "level in output meter, rms setting (except RMS part)"
	},
	{
		"name": "MeterOutputRMSBrush",
		"coords": [289, 762, 298, 771],
		"chartPos": [25, 1],
		"comment": "level in output meter, rms setting (RMS part only)"
	},
	{
		"name": "MeterOutputClipBrush",
		"coords": [301, 762, 310, 771],
		"chartPos": [26, 1],
		"comment": "clipping indicator in output meter"
	},
	{
		"name": "MeterOutputLightPen",
		"coords": [313, 762, 322, 771],
		"chartPos": [27, 1],
		"comment": "???"
	},
	{
		"name": "MeterOutputDarkPen",
		"coords": [325, 762, 334, 771],
		"chartPos": [28, 1],
		"comment": "???"
	},
	{
		"name": "RulerBackground",
		"coords": [337, 762, 346, 771],
		"chartPos": [29, 1],
		"comment": "selection bg in ruler"
	},
	{
		"name": "AxisLines",
		"coords": [349, 762, 358, 771],
		"chartPos": [30, 1],
		"comment": "???"
	},
	{
		"name": "GraphLines",
		"coords": [361, 762, 370, 771],
		"chartPos": [31, 1],
		"comment": "graph line in some dialogs (e.g. Filter Curve EQ, Compressor)"
	},
	{
		"name": "ResponseLines",
		"coords": [373, 762, 382, 771],
		"chartPos": [32, 1],
		"comment": "graph line in Filter Curve EQ (internal smooth line)"
	},
	{
		"name": "HzPlot",
		"coords": [385, 762, 394, 771],
		"chartPos": [33, 1],
		"comment": "spectrum graph in \"Plot Spectrum\" window"
	},
	{
		"name": "WavelengthPlot",
		"coords": [397, 762, 406, 771],
		"chartPos": [34, 1],
		"comment": "other graphs in \"Plot Spectrum\" window"
	},
	{
		"name": "Envelope",
		"coords": [409, 762, 418, 771],
		"chartPos": [35, 1],
		"comment": "all envelope curves"
	},
	{
		"name": "MuteButtonActive",
		"coords": [421, 762, 430, 771],
		"chartPos": [36, 1],
		"comment": "???"
	},
	{
		"name": "MuteButtonVetoed",
		"coords": [1, 774, 10, 783],
		"chartPos": [1, 2],
		"comment": "???"
	},
	{
		"name": "CursorPen",
		"coords": [13, 774, 22, 783],
		"chartPos": [2, 2],
		"comment": "This SHOULD be color of vertical line when you click inside a track.\nAudacity pre-V3.1: keep this BLACK, and the line will be same colour as [1 3].\nV3.1 and beyond: this IS the color of that line"
	},
	{
		"name": "RecordingPen",
		"coords": [25, 774, 34, 783],
		"chartPos": [3, 2],
		"comment": "cursor line during recording ++++ 22/nov 18:38 ++++"
	},
	{
		"name": "PlaybackPen",
		"coords": [37, 774, 46, 783],
		"chartPos": [4, 2],
		"comment": "cursor line during playback ++++ 22/nov 18:38: WHITE ++++"
	},
	{
		"name": "RecordingBrush",
		"coords": [49, 774, 58, 783],
		"chartPos": [5, 2],
		"comment": "???"
	},
	{
		"name": "PlaybackBrush",
		"coords": [61, 774, 70, 783],
		"chartPos": [6, 2],
		"comment": "fill color of scrub/seek arrows"
	},
	{
		"name": "RulerRecordingBrush",
		"coords": [73, 774, 82, 783],
		"chartPos": [7, 2],
		"comment": "selection arrow in ruler (fill color)"
	},
	{
		"name": "RulerRecordingPen",
		"coords": [85, 774, 94, 783],
		"chartPos": [8, 2],
		"comment": "selection arrow in ruler (outline color)"
	},
	{
		"name": "RulerPlaybackBrush",
		"coords": [97, 774, 106, 783],
		"chartPos": [9, 2],
		"comment": "selection arrow in ruler when playback region blocked (fill color)"
	},
	{
		"name": "RulerPlaybackPen",
		"coords": [109, 774, 118, 783],
		"chartPos": [10, 2],
		"comment": "selection arrow in ruler when playback region blocked (outline color)"
	},
	{
		"name": "TimeFont",
		"coords": [121, 774, 130, 783],
		"chartPos": [11, 2],
		"comment": "all texts in time clocks (except focussed digit)\n(May have been replaced by Row 2 Col 25: formerly \"SnapGuide\"?\nUnsure what that means, whether one is  deprecated or they're switched?)"
	},
	{
		"name": "TimeBack",
		"coords": [133, 774, 142, 783],
		"chartPos": [12, 2],
		"comment": "bg of digits in time clocks (except focussed digit)"
	},
	{
		"name": "TimeFontFocus",
		"coords": [145, 774, 154, 783],
		"chartPos": [13, 2],
		"comment": "focussed digit and focus rectangle in time clocks"
	},
	{
		"name": "TimeBackFocus",
		"coords": [157, 774, 166, 783],
		"chartPos": [14, 2],
		"comment": "bg of focussed digit in time clocks"
	},
	{
		"name": "LabelTextNormalBrush",
		"coords": [169, 774, 178, 783],
		"chartPos": [15, 2],
		"comment": "bg of label and fill color of label span line"
	},
	{
		"name": "LabelTextEditBrush",
		"coords": [181, 774, 190, 783],
		"chartPos": [16, 2],
		"comment": "bg of label and fill color of label span line during text edit"
	},
	{
		"name": "LabelUnselectedBrush",
		"coords": [193, 774, 202, 783],
		"chartPos": [17, 2],
		"comment": "bg of label track outside selection; main stripes (white keys) in MIDI clip outside selection"
	},
	{
		"name": "LabelSelectedBrush",
		"coords": [205, 774, 214, 783],
		"chartPos": [18, 2],
		"comment": "bg of label track inside selection; main stripes (white keys) in MIDI clip inside selection"
	},
	{
		"name": "LabelUnselectedPen",
		"coords": [217, 774, 226, 783],
		"chartPos": [19, 2],
		"comment": "???"
	},
	{
		"name": "LabelSelectedPen",
		"coords": [229, 774, 238, 783],
		"chartPos": [20, 2],
		"comment": "???"
	},
	{
		"name": "LabelSurroundPen",
		"coords": [241, 774, 250, 783],
		"chartPos": [21, 2],
		"comment": "outline of label and label span line"
	},
	{
		"name": "TrackFocus0",
		"coords": [253, 774, 262, 783],
		"chartPos": [22, 2],
		"comment": "outline of focussed track (inner line)"
	},
	{
		"name": "TrackFocus1",
		"coords": [265, 774, 274, 783],
		"chartPos": [23, 2],
		"comment": "outline of focussed track (middle line)"
	},
	{
		"name": "TrackFocus2",
		"coords": [277, 774, 286, 783],
		"chartPos": [24, 2],
		"comment": "outline of focussed track (outer line)"
	},
	{
		"name": "SnapGuide",
		"coords": [289, 774, 298, 783], // or [121, 774, 130, 783],
		"chartPos": [25, 2],
		"comment": "snap guide vertical line\n(May have \"changed to(?)\" Row 2 Col 11: formerly \"TimeFont\"?\nUnsure what that means, whether one is overridden, one is deprecated or they're switched?)"
	},
	{
		"name": "TrackInfo",
		"coords": [301, 774, 310, 783],
		"chartPos": [26, 2],
		"comment": "bg of unselected track info panel, time ruler and track vertical ruler; outline of track vertical ruler of selected track; antialias in \"sn, dx\" text in selected track"
	},
	{
		"name": "TrackInfoSelected",
		"coords": [313, 774, 322, 783],
		"chartPos": [27, 2],
		"comment": "bg of selected track info panel; bg of track name overlay (when enabled)"
	},
	{
		"name": "Light",
		"coords": [325, 774, 334, 783],
		"chartPos": [28, 2],
		"comment": "\"light\" in 3D elements (top-left edges of raised elements, bottom-right edges of embossed elements); *** also color of text in pop-up windows e.g. Plot Spectrum"
	},
	{
		"name": "Medium",
		"coords": [337, 774, 346, 783],
		"chartPos": [29, 2],
		"comment": "bg of toolbars, mixer window and meters"
	},
	{
		"name": "Dark",
		"coords": [349, 774, 358, 783],
		"chartPos": [30, 2],
		"comment": "\"shadow\" in 3D elements (bottom-right edges of raised elements, top-left edges of embossed elements), outline of toolbars"
	},
	{
		"name": "LightSelected",
		"coords": [361, 774, 370, 783],
		"chartPos": [31, 2],
		"comment": "???"
	},
	{
		"name": "MediumSelected",
		"coords": [373, 774, 382, 783],
		"chartPos": [32, 2],
		"comment": "bg of toolbar handle on mouseover"
	},
	{
		"name": "DarkSelected",
		"coords": [385, 774, 394, 783],
		"chartPos": [33, 2],
		"comment": "???"
	},
	{
		"name": "Clipped",
		"coords": [397, 774, 406, 783],
		"chartPos": [34, 2],
		"comment": "clipped samples in waveform"
	},
	{
		"name": "MuteClipped",
		"coords": [409, 774, 418, 783],
		"chartPos": [35, 2],
		"comment": "clipped samples in waveform (muted tracks)"
	},
	{
		"name": "ProgressDone",
		"coords": [421, 774, 430, 783],
		"chartPos": [36, 2],
		"comment": "??? (couldn't find any progress bar using this)"
	},
	{
		"name": "ProgressNotYet",
		"coords": [1, 786, 10, 795],
		"chartPos": [1, 3],
		"comment": "??? (couldn't find any progress bar using this)"
	},
	{
		"name": "SyncLockSel",
		"coords": [13, 786, 22, 795],
		"chartPos": [2, 3],
		"comment": "???"
	},
	{
		"name": "SelTranslucent",
		"coords": [25, 786, 34, 795],
		"chartPos": [3, 3],
		"comment": "???"
	},
	{
		"name": "BlankSelected",
		"coords": [37, 786, 46, 795],
		"chartPos": [4, 3],
		"comment": "track background (outside clips), selected"
	},
	{
		"name": "SliderLight",
		"coords": [49, 786, 58, 795],
		"chartPos": [5, 3],
		"comment": "ticks on the sliders, left or top side"
	},
	{
		"name": "SliderMain",
		"coords": [61, 786, 70, 795],
		"chartPos": [6, 3],
		"comment": "body of the sliders"
	},
	{
		"name": "SliderDark",
		"coords": [73, 786, 82, 795],
		"chartPos": [7, 3],
		"comment": "ticks on the sliders, right or bottom side"
	},
	{
		"name": "TrackBackground",
		"coords": [85, 786, 94, 795],
		"chartPos": [8, 3],
		"comment": "bg of timeline below the tracks (also between channels in the same track)"
	},
	{
		"name": "Placeholder1",
		"coords": [97, 786, 106, 795],
		"chartPos": [9, 3],
		"comment": "???"
	},
	{
		"name": "GraphLabels",
		"coords": [109, 786, 118, 795],
		"chartPos": [10, 3],
		"comment": "text labels of the graphs in some dialogs (e.g. compression effect)"
	},
	{
		"name": "SpectroBackground",
		"coords": [121, 786, 130, 795],
		"chartPos": [11, 3],
		"comment": "???"
	},
	{
		"name": "ScrubRuler",
		"coords": [133, 786, 142, 795],
		"chartPos": [12, 3],
		"comment": "bg of scrub ruler"
	},
	{
		"name": "TimeHours",
		"coords": [145, 786, 154, 795],
		"chartPos": [13, 3],
		"comment": "bg of time clocks (except digits, including dropdown arrow button)"
	},
	{
		"name": "FocusBox",
		"coords": [157, 786, 166, 795],
		"chartPos": [14, 3],
		"comment": "???"
	},
	{
		"name": "TrackNameText",
		"coords": [169, 786, 178, 795],
		"chartPos": [15, 3],
		"comment": "???"
	},
	{
		"name": "MidiZebra",
		"coords": [181, 786, 190, 795],
		"chartPos": [16, 3],
		"comment": "alternating stripes (black keys) in MIDI clip"
	},
	{
		"name": "MidiLines",
		"coords": [193, 786, 202, 795],
		"chartPos": [17, 3],
		"comment": "barlines in MIDI clip"
	},
	{
		"name": "TextNegativeNumbers",
		"coords": [205, 786, 214, 795],
		"chartPos": [18, 3],
		"comment": "negative times in ruler (when enabled)"
	},
	{
		"name": "Spectro1",
		"coords": [217, 786, 226, 795],
		"chartPos": [19, 3],
		"comment": "spectral view, color 1 (not used)"
	},
	{
		"name": "Spectro2",
		"coords": [229, 786, 238, 795],
		"chartPos": [20, 3],
		"comment": "spectral view, color 2 (softest sounds)"
	},
	{
		"name": "Spectro3",
		"coords": [241, 786, 250, 795],
		"chartPos": [21, 3],
		"comment": "spectral view, color 3 (softer sounds)"
	},
	{
		"name": "Spectro4",
		"coords": [253, 786, 262, 795],
		"chartPos": [22, 3],
		"comment": "spectral view, color 4 (louder sounds)"
	},
	{
		"name": "Spectro5",
		"coords": [265, 786, 274, 795],
		"chartPos": [23, 3],
		"comment": "spectral view, color 5 (loudest sounds); fill color of spectrum area while recording (not yet elaborated)"
	},
	{
		"name": "Spectro1Sel",
		"coords": [277, 786, 286, 795],
		"chartPos": [24, 3],
		"comment": "spectral view, color 1, selected, except spectral freq sel (not used)"
	},
	{
		"name": "Spectro2Sel",
		"coords": [289, 786, 298, 795],
		"chartPos": [25, 3],
		"comment": "spectral view, color 2, selected, except spectral freq sel (softest sounds)"
	},
	{
		"name": "Spectro3Sel",
		"coords": [301, 786, 310, 795],
		"chartPos": [26, 3],
		"comment": "spectral view, color 3, selected, except spectral freq sel (softer sounds)"
	},
	{
		"name": "Spectro4Sel",
		"coords": [313, 786, 322, 795],
		"chartPos": [27, 3],
		"comment": "spectral view, color 4, selected, except spectral freq sel (louder sounds)"
	},
	{
		"name": "Spectro5Sel",
		"coords": [325, 786, 334, 795],
		"chartPos": [28, 3],
		"comment": "spectral view, color 5, selected, except spectral freq sel (loudest sounds)"
	},
	{
		"name": "unknown",
		"coords": [337, 786, 346, 795],
		"chartPos": [29, 3],
		"comment": "???"
	},
	{
		"name": "ClipHeader",
		"coords": [349, 786, 358, 795],
		"chartPos": [30, 3],
		"comment": "color of the header for each clip within a track"
	},
	{
		"name": "ClipHeaderHover",
		"coords": [361, 786, 370, 795],
		"chartPos": [31, 3],
		"comment": "color, with mouse ptr hovered over it, of the header for each clip within a track"
	},
	{
		"name": "unknown",
		"coords": [373, 786, 382, 795],
		"chartPos": [32, 3],
		"comment": "???"
	},
	{
		"name": "unknown",
		"coords": [385, 786, 394, 795],
		"chartPos": [33, 3],
		"comment": "???"
	},
	{
		"name": "ClipHeaderText",
		"coords": [397, 786, 406, 795],
		"chartPos": [34, 3],
		"comment": "color of the clip name within clip header within a track"
	},
	{
		"name": "unknown",
		"coords": [409, 786, 418, 795],
		"chartPos": [35, 3],
		"comment": "???"
	}
];
var colorCoords_unannotated = {
	"Blank": [1,762,10,771],
	"Unselected": [13,762,22,771],
	"Selected": [25,762,34,771],
	"Sample": [37,762,46,771],
	"SelSample": [49,762,58,771],
	"DragSample": [61,762,70,771],
	"MuteSample": [73,762,82,771],
	"Rms": [85,762,94,771],
	"MuteRms": [97,762,106,771],
	"Shadow": [109,762,118,771],
	"AboutBackground": [121,762,130,771],
	"TrackPanelText": [133,762,142,771],
	"LabelTrackText": [145,762,154,771],
	"MeterPeak": [157,762,166,771],
	"MeterDisabledPen": [169,762,178,771],
	"MeterDisabledBrush": [181,762,190,771],
	"MeterInputPen": [193,762,202,771],
	"MeterInputBrush": [205,762,214,771],
	"MeterInputRMSBrush": [217,762,226,771],
	"MeterInputClipBrush": [229,762,238,771],
	"MeterInputLightPen": [241,762,250,771],
	"MeterInputDarkPen": [253,762,262,771],
	"MeterOutputPen": [265,762,274,771],
	"MeterOutputBrush": [277,762,286,771],
	"MeterOutputRMSBrush": [289,762,298,771],
	"MeterOutputClipBrush": [301,762,310,771],
	"MeterOutputLightPen": [313,762,322,771],
	"MeterOutputDarkPen": [325,762,334,771],
	"RulerBackground": [337,762,346,771],
	"AxisLines": [349,762,358,771],
	"GraphLines": [361,762,370,771],
	"ResponseLines": [373,762,382,771],
	"HzPlot": [385,762,394,771],
	"WavelengthPlot": [397,762,406,771],
	"Envelope": [409,762,418,771],
	"MuteButtonActive": [421,762,430,771],
	"MuteButtonVetoed": [1,774,10,783],
	"CursorPen": [13,774,22,783],
	"RecordingPen": [25,774,34,783],
	"PlaybackPen": [37,774,46,783],
	"RecordingBrush": [49,774,58,783],
	"PlaybackBrush": [61,774,70,783],
	"RulerRecordingBrush": [73,774,82,783],
	"RulerRecordingPen": [85,774,94,783],
	"RulerPlaybackBrush": [97,774,106,783],
	"RulerPlaybackPen": [109,774,118,783],
	"TimeFont": [121,774,130,783],
	"TimeBack": [133,774,142,783],
	"TimeFontFocus": [145,774,154,783],
	"TimeBackFocus": [157,774,166,783],
	"LabelTextNormalBrush": [169,774,178,783],
	"LabelTextEditBrush": [181,774,190,783],
	"LabelUnselectedBrush": [193,774,202,783],
	"LabelSelectedBrush": [205,774,214,783],
	"LabelUnselectedPen": [217,774,226,783],
	"LabelSelectedPen": [229,774,238,783],
	"LabelSurroundPen": [241,774,250,783],
	"TrackFocus0": [253,774,262,783],
	"TrackFocus1": [265,774,274,783],
	"TrackFocus2": [277,774,286,783],
	"SnapGuide": [289,774,298,783],
	"TrackInfo": [301,774,310,783],
	"TrackInfoSelected": [313,774,322,783],
	"Light": [325,774,334,783],
	"Medium": [337,774,346,783],
	"Dark": [349,774,358,783],
	"LightSelected": [361,774,370,783],
	"MediumSelected": [373,774,382,783],
	"DarkSelected": [385,774,394,783],
	"Clipped": [397,774,406,783],
	"MuteClipped": [409,774,418,783],
	"ProgressDone": [421,774,430,783],
	"ProgressNotYet": [1,786,10,795],
	"SyncLockSel": [13,786,22,795],
	"SelTranslucent": [25,786,34,795],
	"BlankSelected": [37,786,46,795],
	"SliderLight": [49,786,58,795],
	"SliderMain": [61,786,70,795],
	"SliderDark": [73,786,82,795],
	"TrackBackground": [85,786,94,795],
	"Placeholder1": [97,786,106,795],
	"GraphLabels": [109,786,118,795],
	"SpectroBackground": [121,786,130,795],
	"ScrubRuler": [133,786,142,795],
	"TimeHours": [145,786,154,795],
	"FocusBox": [157,786,166,795],
	"TrackNameText": [169,786,178,795],
	"MidiZebra": [181,786,190,795],
	"MidiLines": [193,786,202,795],
	"TextNegativeNumbers": [205,786,214,795],
	"Spectro1": [217,786,226,795],
	"Spectro2": [229,786,238,795],
	"Spectro3": [241,786,250,795],
	"Spectro4": [253,786,262,795],
	"Spectro5": [265,786,274,795],
	"Spectro1Sel": [277,786,286,795],
	"Spectro2Sel": [289,786,298,795],
	"Spectro3Sel": [301,786,310,795],
	"Spectro4Sel": [313,786,322,795],
	"Spectro5Sel": [325,786,334,795]
};