function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
  var url = `/metadata/${sample}`;
  d3.json(url).then((response) => {
      console.log(response);
      var metaPanel = d3.select('#sample-metadata');
      metaPanel.html("");
     // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
      Object.entries(response).forEach(([key,value])=> {
        metaPanel.append("h6").text(`${key}: ${value}`)
      } ) 
    });
}

function buildCharts(sample) {
// @TODO: Use `d3.json` to fetch the sample data for the plots

  var url = `/samples/${sample}`
  d3.json(url).then((response) => {
    console.log(response);
       

//https://plot.ly/javascript/bubble-charts/
// @TODO: Build a Bubble Chart
    var trace1 = {
      x: response.otu_ids,
      y: response.sample_values,
      text: response.otu_labels,
      mode: 'markers',
      marker: {
        color: response.otu_ids,
        size: response.sample_values
      } 
    };

    var data = [trace1];

    var layout = {
      xaxis: { title: "OTU ID"},
    };

    Plotly.newPlot('bubble', data, layout);


// @TODO: Build a Pie Chart

    d3.json(url).then((response) => { 

      var data = [{
        values: response.sample_values.slice(0,10),
        labels: response.otu_ids.slice(0,10),
        hovertext: response.otu_labels.slice(0,10),
        type: 'pie'
      }];

      Plotly.newPlot('pie', data);
    });
  });
} // end of function buildCharts(sample)


function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  console.log(selector)

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