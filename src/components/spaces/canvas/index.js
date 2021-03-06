'use strict';

import React, {Component, PropTypes} from 'react'
import { connect } from 'react-redux';

import Grid from 'gComponents/lib/grid/grid/'
import Metric from 'gComponents/metrics/card'

import { changeMetric, addMetric } from 'gModules/metrics/actions'
import { changeSelect } from 'gModules/selection/actions'
import { runSimulations, deleteSimulations } from 'gModules/simulations/actions'

import './canvas.styl'
import { userActionSelector } from './canvas-state-selector';
import { denormalizedSpaceSelector } from '../denormalized-space-selector.js';
import JSONTree from 'react-json-tree'

function mapStateToProps(state) {
  return {
    canvasState: state.canvasState,
    selected: state.selection,
  }
}

const PT = PropTypes;
@connect(mapStateToProps)
@connect(userActionSelector)
@connect(denormalizedSpaceSelector)
export default class CanvasSpace extends Component{
  static propTypes = {
    canvasState: PT.shape({
      metricCardView: PT.oneOf([
        'normal',
        'basic',
        'scientific',
        'debugging',
      ]).isRequired,
      edgeView: PT.oneOf([
        'hidden',
        'visible',
      ]).isRequired,
    }),
    denormalizedSpace: PropTypes.object,
    dispatch: PropTypes.func,
    guesstimateForm: PropTypes.object,
    isSelected: PropTypes.bool,
    selected: PropTypes.object,
    spaceId: PropTypes.oneOfType([
        React.PropTypes.string,
        React.PropTypes.number,
    ]),
    userAction: PropTypes.oneOf([
      'selecting',
      'function',
      'estimate',
      'editing'
    ]),
  }

  componentDidMount(){
    this.props.dispatch(runSimulations({spaceId: this.props.denormalizedSpace.id}))
  }

  componentWillUnmount(){
    this.props.dispatch(deleteSimulations(this.props.denormalizedSpace.metrics.map(m => m.id)))
  }

  _handleSelect(location) {
    this.props.dispatch(changeSelect(location))
  }

  _handleAddMetric(location) {
    this.props.dispatch(addMetric({space: this.props.spaceId, location: location, isNew: true}))
  }

  _handleMoveMetric({prev, next}) {
    const metric = this.props.denormalizedSpace.metrics.find(f => _.isEqual(f.location, prev))
    this.props.dispatch(changeMetric({id: metric.id, location: next}))
    this.props.dispatch(changeSelect(next))
  }


  renderMetric(metric) {
    const {location} = metric
    return (
      <Metric
          canvasState={this.props.canvasState}
          handleSelect={this._handleSelect.bind(this)}
          key={metric.id}
          location={location}
          metric={metric}
          userAction={this.props.userAction}
      />
    )
  }

  showEdges() {
    return (this.props.canvasState.edgeView === 'visible')
  }

  edges() {
    let edges = []

    if (this.showEdges()){
      const space = this.props.denormalizedSpace
      const {metrics} = space
      const metricIdToLocation = (metricId) => metrics.find(m => m.id === metricId).location

      edges = space.edges.map(e => {
        return {input: metricIdToLocation(e.input), output: metricIdToLocation(e.output)}
      })
    }
    return edges
  }

  render () {
    const {selected} = this.props
    const {metrics} = this.props.denormalizedSpace
    const {metricCardView} = this.props.canvasState

    const edges = this.edges()
    let className = 'canvas-space'

    this.showEdges() ? className += ' showEdges' : ''

    return (
      <div className={className}>
        {(metricCardView === 'debugging') &&
          <JSONTree data={this.props}/>
        }
        <Grid
            edges={edges}
            handleSelect={this._handleSelect.bind(this)}
            onAddItem={this._handleAddMetric.bind(this)}
            onMoveItem={this._handleMoveMetric.bind(this)}
            selected={selected}
        >
          {metrics.map((m) => {
              return this.renderMetric(m)
          })}
        </Grid>
      </div>
    );
  }
}
