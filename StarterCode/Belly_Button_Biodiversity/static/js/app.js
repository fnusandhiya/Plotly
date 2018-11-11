/* data route */
// @TODO: Complete the following function that builds the metadata panel
function buildMetadata(sample) {
  var url = "/metadata/" + sample
  // Use `d3.json` to fetch the metadata for a sample
  d3.json(url).then(function(response){
    console.log(response);
    // Use d3 to select the panel with id of `#sample-metadata`
    var panel = d3.select('#sample-metadata');
    console.log(panel);
    // Use `.html("") to clear any existing metadata
    panel.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(response).forEach(([key, value]) => {
      var cell = panel.append("div");
      cell.text(key + ": " + value);
    })
  })
};
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);


function buildCharts(sample) {
  var url = '/samples/' + sample
  // @TODO: Use `d3.json` to fetch the sample data for the plots
  d3.json(url).then(function(response){
    console.log(response);
    // HINT: You will need to use slice() to grab the top 10 sample_values,
    // otu_ids, and labels (10 each).
    var a = response['otu_ids'].slice(0,11)
    console.log(a);
    var b = response['sample_values'].slice(0, 11)
    var c = response['otu_labels'].slice(0, 11)
    // @TODO: Build a Pie Chart
    var trace = {
      type: "pie",
      lables: a,
      value: b,
      hovertext: c
    };

  var data = [trace];
  Plotly.newPlot("pie", data);
// @TODO: Build a Bubble Chart using the sample data
  var trace1 = {
    type: "bubble",
    x= a,
    y= b,
    mode='markers',
    marker: {
      size: response['sample_values'],
      colors: response['otu_ids'],
      text: response['otu_labels']
    }
  };

  var data1 = [trace1];
  Plotly.newPlot("bubble", data1);

  });
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
