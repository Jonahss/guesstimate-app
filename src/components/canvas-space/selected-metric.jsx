import React, {Component, PropTypes} from 'react';
import {connectReduxForm} from 'redux-form';

import Button from 'react-bootstrap/lib/Button'
import Input from 'react-bootstrap/lib/Input'
import GuesstimateForm from './guesstimate-form'

const BasicInput = React.createClass({
  getInitialState() {
    return {
      value: this.props.value || ''
    };
  },
  componentWillUnmount() {
    this._handleBlur()
  },
  _handleChange() {
    this.setState({ value: this.refs.input.getValue()});
  },
  _handleBlur(){
    let values = {}
    values[this.props.name] = this.state.value
    this.props.onChange(values)
  },
  _handleSubmit(e) {
    if (e.keyCode === 13) {
      this.handleBlur()
    }
  },
  render() {
    return (
      <Input
        tabIndex={2}
        type='text'
        placeholder={this.props.name}
        name={this.props.name}
        value={this.state.value}
        ref='input'
        onBlur={this._handleBlur}
        onKeyDown={this._handleSubmit}
        onChange={this._handleChange} />
    );
  }
});

let SelectedMetric = React.createClass({
  _handlePress(e) {
    if (e.target === this.getDOMNode()) {
      if (e.keyCode == '8') {
        e.preventDefault()
        this.props.onRemove()
      }
      this.props.gridKeyPress(e)
      e.stopPropagation()
    } else {
      e.stopPropagation()
    }
  },
  _handleChange(values) {
    this.props.handleChange(values)
  },
  render () {
    const distribution = 'hi there'
    return (
      <div className='metric grid-item-focus' onKeyDown={this._handlePress} tabIndex='0'>
         <div className='row row1'>
          <div className='col-sm-9 median' >
            <GuesstimateForm value={this.props.metric.value} onSubmit={this._handleChange}/>
          </div>
          <div className='col-sm-3'>
            <Button bsStyle='default' onClick={this.props.onRemove}> x </Button>
          </div>
         </div>
         <div className='row row2'>
           <div className='col-sm-9 name'>
            <BasicInput name="name" value={this.props.metric.name} onChange={this._handleChange}/>
           </div>
         </div>
      </div>
    )
  }
})

export default SelectedMetric