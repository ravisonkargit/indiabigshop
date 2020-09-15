import React, { Component } from 'react'

export default class LoadingComponent extends Component {
    render() {
        return (
            <div className="container text-center">
                <div
                className="spinner-border my-5"
                style={{ color: "orange" }}
                role="status"
                >
                <span className="sr-only">Loading...</span>
                </div>
            </div>
        )
    }
}
