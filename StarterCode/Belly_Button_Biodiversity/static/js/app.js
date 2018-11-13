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
    var a = response['otu_ids'].slice(0,10)
    console.log(a);
    var b = response['sample_values'].slice(0, 10)
    var c = response['otu_labels'].slice(0, 10)
    // @TODO: Build a Pie Chart
    var trace = {
      type: "pie",
      lables: a,
      values: b,
      hovertext: c
    };

    var layout = {
      height: 700,
      width: 400
    };

  var data = [trace];
  Plotly.newPlot("pie", data, layout);
// @TODO: Build a Bubble Chart using the sample data
  var trace1 = {
    type: "bubble",
    x: response['otu_ids'],
    y: response['sample_values'],
    text: response['sample_values'],
    mode:'markers',
    marker: {
      size: response['sample_values'],
      colors: response['otu_ids'],
      colorscale: 'Earth'
    }
  };
  var Layout = {
    margin: { t: 0 },
    xaxis: { title: 'OTU ID' }
};
  var data1 = [trace1];

  Plotly.newPlot("bubble", data1, Layout);

  });
};

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
