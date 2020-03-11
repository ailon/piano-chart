document.addEventListener("DOMContentLoaded", function () {
  let piano = new pianoChart.Instrument(document.getElementById('pianoContainer'),
  {
    //showNoteNames: "onhighlight",
    startOctave: 3,
    endOctave: 5,
    highlightedNotes: ["D", "E", "F#", "G", "A", "B", "C#"],
    specialHighlightedNotes: [{ note: "D" }],
    // showOctaveNumbers: true
  });
  piano.create();
  piano.keyDown("D4");
  piano.keyDown("F#4");
  piano.keyDown("A4");
});
