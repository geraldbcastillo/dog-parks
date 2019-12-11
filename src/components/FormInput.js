import React from "react";

class FormInput extends React.Component {
    render() {
        return (
            <div className="form-group">
                <label htmlFor={this.props.id}>{this.props.label}</label>
                <input
                    className="form-control"
                    id={this.props.id}
                    aria-describedby={this.props.id}
                    value={this.props.value}
                    onChange={this.props.onChange}
                    placeholder={this.props.placeholder}
                />
            </div>
        );
    }
}

export default FormInput;
