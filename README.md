# Comparing Transportalities Based on Mode (1975-2020)

A simple visualization exploring the progression of transportation fatalities across 5 different modes (Car, Pedestrian, Motorcycle, Bicycle, Truck) from 1975 to 2020. Developed using D3.js framework.  

Final project for CS 4460 Intro InfoViz course taught by Dr. Clio Andris at Georgia Tech.

## Data Source

Data taken from the [Fatality Facts 2020 Yearly Snapshot](https://www.iihs.org/topics/fatality-statistics/detail/yearly-snapshot) provided by the Insurance Institute for Highway Safety (IIHS). The data was cleaned up and formatted into a CSV file to be provided for the class.

## Locally Running the Viz

All you need is a Web Browser (Chrome is recommended) and Python installed to run a local web server to host the visulization.

To run the server, navigate to this repository using the Terminal (Windows Terminal is recommended over Command Prompt). Then, run the following python command to run the server.

Python 2.x:
```
python -m SimpleHTTPServer 8080
```

Python 3.x:
```
python -m http.server 8080
```

After the server is up and running, open `http://localhost:8080/` on your browser and you should see the following.

![Viz Image](/viz-image)

Now you're ready to explore the viz! You can filter by transportation mode, view specific numbers for each year by hovering on the chart, and change between non-cumulative and cumulative fatalities.
