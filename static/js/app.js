// Setting URL
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";
 
d3.json(url).then(function(data) {console.log(data);}).catch(error => {console.error(error);});

// The below function uses the metadata to get the demographics with the matching id value.
function myMetadata(subject) {
  d3.json(url).then((data) => { 
    const metadata = data.metadata;
    let resultArray = metadata.filter(subjectSample => subjectSample.id == subject);
    let result = resultArray[0];
    let PANEL = d3.select("#sample-metadata");
    PANEL.html("");
    // Append new tags for each key value.
    for (key in result){
      PANEL.append("h6").text(`${key}: ${result[key]}`);
    };
  }).catch(error => {console.error(error);});
}

// Using the sample_values from samples, creating the bar and bubble chart
function myGraphs(subject) {
  d3.json(url).then((data) => {
    const samples = data.samples;
    let resultArray = samples.filter(subjectSample => subjectSample.id == subject);
    let result = resultArray[0];
    // Declaring other variables to be used for the charts
    let otu_ids = result.otu_ids;
    let otu_labels = result.otu_labels;
    let sample_values = result.sample_values;
    

    // Creating the top 10 bacteria cultures bar chart for each subject ID
    let yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    const barData = [
      {
        y: yticks,
        x: sample_values.slice(0, 10).reverse(),
        text: otu_labels.slice(0, 10).reverse(),
        type: "bar",
        orientation: "h",
      }
    ];
    // Creating the bar chart layout 
    const barLayout = {
      title: "Top 10 Bacteria Cultures Found",
      margin: { t: 30, l: 150 }
    };

    // Displaying the bar chart
    Plotly.newPlot("bar", barData, barLayout);

    // Creating the bubble chart of the bacteria cultures for each subject ID no selected
    const bubbleData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth"
        }
      }
    ];
    // Creating the bubble chart layout
    const bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      margin: { t: 0 },
      hovermode: "closest",
      xaxis: { title: "OTU ID" },
      margin: { t: 30}
    };
    // Display the bubble chart
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
 
  }).catch(error => {console.error(error);});
}

// Assigning a test subject ID no for the dashboard
function init() {
  let dropdown = d3.select("#selDataset");
  d3.json(url).then((data) => {
    let subjectIds = data.names;
    for (let i = 0; i < subjectIds.length; i++){
      dropdown
        .append("option")
        .text(subjectIds[i])
        .property("value", subjectIds[i]);
    };
    const firstID = subjectIds[0];
    myGraphs(firstID);
    myMetadata(firstID);
  }).catch(error => {console.error(error);});
}

// Updates dashboard with new subject ID
function optionChanged(newSubject) {
  myMetadata(newSubject);
  myGraphs(newSubject);
}
// Initializing dashboard
init();