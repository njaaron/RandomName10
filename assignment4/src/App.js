import React, { Component } from "react";
import "./App.css";
import * as d3 from "d3";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { wordFrequency: [] };
  }

  componentDidUpdate() {
    this.renderChart();
  }

  getWordFrequency = (text) => {
    const stopWords = new Set([
      "the", "and", "a", "an", "in", "on", "at", "for", "with", "about", "as", "by", "to", "of", "from", "that",
      "which", "who", "whom", "this", "these", "those", "it", "its", "they", "their", "them", "we", "our", "ours",
      "you", "your", "yours", "he", "him", "his", "she", "her", "hers", "it", "its", "we", "us", "our", "ours",
      "they", "them", "theirs", "I", "me", "my", "myself", "you", "yourself", "yourselves", "was", "were", "is",
      "am", "are", "be", "been", "being", "have", "has", "had", "having", "do", "does", "did", "doing", "a", "an",
      "the", "as", "if", "each", "how", "which", "who", "whom", "what", "this", "these", "those", "that", "with",
      "without", "through", "over", "under", "above", "below", "between", "among", "during", "before", "after",
      "until", "while", "of", "for", "on", "off", "out", "in", "into", "by", "about", "against", "with",
      "amongst", "throughout", "despite", "towards", "upon", "isn't", "aren't", "wasn't", "weren't", "haven't",
      "hasn't", "hadn't", "doesn't", "didn't", "don't", "doesn't", "didn't", "won't", "wouldn't", "can't",
      "couldn't", "shouldn't", "mustn't", "needn't", "daren't", "hasn't", "haven't", "hadn't"
    ]);
    const words = text.toLowerCase().replace(/[.,/#!$%^&*;:{}=_`~()]/g, "").replace(/\s{2,}/g, " ").split(" ");
    const filteredWords = words.filter(word => !stopWords.has(word));
    return Object.entries(filteredWords.reduce((freq, word) => {
      freq[word] = (freq[word] || 0) + 1;
      return freq;
    }, {}));
  }

  renderChart() {
    const data = this.state.wordFrequency.sort((a, b) => b[1] - a[1]).slice(0, 5);
    const svg = d3.select(".svg_parent");
    svg.attr("width", 800).attr("height", 200);
    const fontScale = d3.scaleLinear()
      .domain([data[data.length - 1]?.[1] || 0, data[0]?.[1] || 0])
      .range([20, 80]);
    let cumulativeX = 10;
    const words = svg.selectAll("text")
      .data(data, d => d[0]); 
    words.exit()
      .transition()
      .duration(1000)
      .style("opacity", 0)
      .remove();
    const newWords = words.enter()
      .append("text")
      .style("fill", "black")
      .style("font-size", "1px") 
      .attr("y", 100)
      .attr("x", d => {
        const x = cumulativeX;
        cumulativeX += fontScale(d[1]) * d[0].length * 0.6 + 10;
        return x;
      })
      .text(d => d[0]);
    const allWords = newWords.merge(words);
    cumulativeX = 10;
    allWords.transition()
      .duration(2000)
      .attr("x", d => {
        const x = cumulativeX;
        cumulativeX += fontScale(d[1]) * d[0].length * 0.6 + 10;
        return x;
      })
      .style("font-size", d => `${fontScale(d[1])}px`);
  }

  render() {
    return (
      <div className="parent">
        <div className="child1" style={{ width: 1000 }}>
          <textarea id="input_field" style={{ height: 150, width: 1000 }} />
          <button
            type="submit"
            value="Generate WordCloud"
            style={{ marginTop: 10, height: 40, width: 1000 }}
            onClick={() => {
              const input_data = document.getElementById("input_field").value;
              this.setState({ wordFrequency: this.getWordFrequency(input_data) });
            }}
          >
            Generate WordCloud
          </button>
        </div>
        <div className="child2">
          <svg className="svg_parent"></svg>
        </div>
      </div>
    );
  }
}

export default App;
