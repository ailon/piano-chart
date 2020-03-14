let piano;
document.addEventListener("DOMContentLoaded", function () {
  piano = new pianoChart.Instrument(document.getElementById('pianoContainer'),
  {
    //showNoteNames: "onhighlight",
    startOctave: 3,
    endOctave: 5,
    highlightedNotes: ["D", "E", "F#", "G", "Ab", "B", "C#"],
    specialHighlightedNotes: [{ note: "D", accidental: 'bb' }],
    // showOctaveNumbers: true
  });
  piano.create();
  piano.keyDown("D4");
  piano.keyDown("Gb4");
  piano.keyDown("A4");
});
