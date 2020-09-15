import React, { Component } from "react";
import { Link } from "react-router-dom";
import { isMobile } from "react-device-detect";


export class Categoryli1 extends Component {
  constructor(props) {
      super(props);
    this.state = {};
  }
  render() {
    const { categories } = this.props;
    return (
      <ul className={!isMobile ? 'widthClass mx-2' : ''}>
        {Object.entries(categories.name)
          .splice(11,10)
          .map(([key1, value1]) => (
            <li key={key1} className="text-break custom_text text-capitalize custom_li">
              <Link
                to={`${process.env.PUBLIC_URL}/cat/${categories.url.toLowerCase()}/${value1.url.toLowerCase()}.html`}
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

export default Categoryli1;
