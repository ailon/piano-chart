document.addEventListener("DOMContentLoaded", function () {
  let piano = new pianoChart.Instrument(document.getElementById('pianoContainer'),
  {
    showNoteNames: "onhighlight",
    highlightedNotes: ["C", "C#3", "D#3", "FX", { note: "E", octave: 3 }],
    specialHighlightedNotes: [{ note: "C" }],
    showOctaveNumbers: true
  });
  piano.create();
});
