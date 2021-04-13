import React, { Component } from "react";
import { Link } from "react-router-dom";
import { isMobile } from "react-device-detect";



export class Categoryli extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const { categories } = this.props;
    console.log(this.props)
    return (
      <ul className={!isMobile ? 'widthClass' : ''}>
        {Object.entries(categories.name)
          .splice(0, 10)
          .map(([key1, value1]) => (
            <li key={key1} className="text-break custom_text text-capitalize custom_li">
              <Link
                to={`${process.env.PUBLIC_URL}/cat/${categories.url}/${value1.url}.html`}
                target="_blank"
              >
                {key1}
              </Link>
            </li>
          ))}
      </ul>
    );
  }
}

export default Categoryli;
