'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

require('core-js/modules/es.array.iterator');
require('core-js/modules/es.array.map');
require('core-js/modules/es.object.to-string');
require('core-js/modules/es.promise');
require('core-js/modules/es.string.iterator');
require('core-js/modules/web.dom-collections.iterator');
var _slicedToArray = _interopDefault(require('@babel/runtime/helpers/slicedToArray'));
var _objectSpread2 = _interopDefault(require('@babel/runtime/helpers/objectSpread'));
var _classCallCheck = _interopDefault(require('@babel/runtime/helpers/classCallCheck'));
var _possibleConstructorReturn = _interopDefault(require('@babel/runtime/helpers/possibleConstructorReturn'));
var _getPrototypeOf = _interopDefault(require('@babel/runtime/helpers/getPrototypeOf'));
var _createClass = _interopDefault(require('@babel/runtime/helpers/createClass'));
var _inherits = _interopDefault(require('@babel/runtime/helpers/inherits'));
var React = require('react');
var React__default = _interopDefault(React);
var PropTypes = require('prop-types');
var ramda = require('ramda');
var _extends = _interopDefault(require('@babel/runtime/helpers/extends'));
var _objectWithoutProperties = _interopDefault(require('@babel/runtime/helpers/objectWithoutProperties'));
require('core-js/modules/es.array.concat');
require('core-js/modules/es.array.filter');
require('core-js/modules/es.array.for-each');
require('core-js/modules/es.array.includes');
require('core-js/modules/es.array.reduce');
require('core-js/modules/es.array.sort');
require('core-js/modules/es.array.splice');
require('core-js/modules/es.function.name');
require('core-js/modules/es.number.constructor');
require('core-js/modules/es.number.max-safe-integer');
require('core-js/modules/es.object.entries');
require('core-js/modules/es.object.from-entries');
require('core-js/modules/es.object.keys');
require('core-js/modules/es.string.includes');
require('core-js/modules/web.dom-collections.for-each');
var _defineProperty = _interopDefault(require('@babel/runtime/helpers/defineProperty'));
var _toConsumableArray = _interopDefault(require('@babel/runtime/helpers/toConsumableArray'));
var _regeneratorRuntime = _interopDefault(require('@babel/runtime/regenerator'));
require('regenerator-runtime/runtime');
var _asyncToGenerator = _interopDefault(require('@babel/runtime/helpers/asyncToGenerator'));

var isQueryPresent = (function (query) {
  return query.measures && query.measures.length || query.dimensions && query.dimensions.length || query.timeDimensions && query.timeDimensions.length;
});

var CubeContext = React.createContext(null);

var QueryRenderer =
/*#__PURE__*/
function (_React$Component) {
  _inherits(QueryRenderer, _React$Component);

  _createClass(QueryRenderer, null, [{
    key: "isQueryPresent",
    value: function isQueryPresent$$1(query) {
      return isQueryPresent(query);
    }
  }]);

  function QueryRenderer(props) {
    var _this;

    _classCallCheck(this, QueryRenderer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(QueryRenderer).call(this, props));
    _this.state = {};
    _this.mutexObj = {};
    return _this;
  }

  _createClass(QueryRenderer, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      var _this$props = this.props,
          query = _this$props.query,
          queries = _this$props.queries;

      if (query) {
        this.load(query);
      }

      if (queries) {
        this.loadQueries(queries);
      }
    }
  }, {
    key: "shouldComponentUpdate",
    value: function shouldComponentUpdate(nextProps, nextState) {
      var _this$props2 = this.props,
          query = _this$props2.query,
          queries = _this$props2.queries,
          render = _this$props2.render,
          cubejsApi = _this$props2.cubejsApi,
          loadSql = _this$props2.loadSql,
          updateOnlyOnStateChange = _this$props2.updateOnlyOnStateChange;

      if (!updateOnlyOnStateChange) {
        return true;
      }

      return !ramda.equals(nextProps.query, query) || !ramda.equals(nextProps.queries, queries) || (nextProps.render == null || render == null) && nextProps.render !== render || nextProps.cubejsApi !== cubejsApi || nextProps.loadSql !== loadSql || !ramda.equals(nextState, this.state) || nextProps.updateOnlyOnStateChange !== updateOnlyOnStateChange;
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps) {
      var _this$props3 = this.props,
          query = _this$props3.query,
          queries = _this$props3.queries;

      if (!ramda.equals(prevProps.query, query)) {
        this.load(query);
      }

      if (!ramda.equals(prevProps.queries, queries)) {
        this.loadQueries(queries);
      }
    }
  }, {
    key: "cubejsApi",
    value: function cubejsApi() {
      // eslint-disable-next-line react/destructuring-assignment
      return this.props.cubejsApi || this.context && this.context.cubejsApi;
    }
  }, {
    key: "load",
    value: function load(query) {
      var _this2 = this;

      var resetResultSetOnChange = this.props.resetResultSetOnChange;
      this.setState(_objectSpread2({
        isLoading: true,
        error: null,
        sqlQuery: null
      }, resetResultSetOnChange ? {
        resultSet: null
      } : {}));
      var loadSql = this.props.loadSql;
      var cubejsApi = this.cubejsApi();

      if (query && QueryRenderer.isQueryPresent(query)) {
        if (loadSql === 'only') {
          cubejsApi.sql(query, {
            mutexObj: this.mutexObj,
            mutexKey: 'sql'
          }).then(function (sqlQuery) {
            return _this2.setState({
              sqlQuery: sqlQuery,
              error: null,
              isLoading: false
            });
          })["catch"](function (error) {
            return _this2.setState(_objectSpread2({}, resetResultSetOnChange ? {
              resultSet: null
            } : {}, {
              error: error,
              isLoading: false
            }));
          });
        } else if (loadSql) {
          Promise.all([cubejsApi.sql(query, {
            mutexObj: this.mutexObj,
            mutexKey: 'sql'
          }), cubejsApi.load(query, {
            mutexObj: this.mutexObj,
            mutexKey: 'query'
          })]).then(function (_ref) {
            var _ref2 = _slicedToArray(_ref, 2),
                sqlQuery = _ref2[0],
                resultSet = _ref2[1];

            return _this2.setState({
              sqlQuery: sqlQuery,
              resultSet: resultSet,
              error: null,
              isLoading: false
            });
          })["catch"](function (error) {
            return _this2.setState(_objectSpread2({}, resetResultSetOnChange ? {
              resultSet: null
            } : {}, {
              error: error,
              isLoading: false
            }));
          });
        } else {
          cubejsApi.load(query, {
            mutexObj: this.mutexObj,
            mutexKey: 'query'
          }).then(function (resultSet) {
            return _this2.setState({
              resultSet: resultSet,
              error: null,
              isLoading: false
            });
          })["catch"](function (error) {
            return _this2.setState(_objectSpread2({}, resetResultSetOnChange ? {
              resultSet: null
            } : {}, {
              error: error,
              isLoading: false
            }));
          });
        }
      }
    }
  }, {
    key: "loadQueries",
    value: function loadQueries(queries) {
      var _this3 = this;

      var cubejsApi = this.cubejsApi();
      var resetResultSetOnChange = this.props.resetResultSetOnChange;
      this.setState(_objectSpread2({
        isLoading: true
      }, resetResultSetOnChange ? {
        resultSet: null
      } : {}, {
        error: null
      }));
      var resultPromises = Promise.all(ramda.toPairs(queries).map(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
            name = _ref4[0],
            query = _ref4[1];

        return cubejsApi.load(query, {
          mutexObj: _this3.mutexObj,
          mutexKey: name
        }).then(function (r) {
          return [name, r];
        });
      }));
      resultPromises.then(function (resultSet) {
        return _this3.setState({
          resultSet: ramda.fromPairs(resultSet),
          error: null,
          isLoading: false
        });
      })["catch"](function (error) {
        return _this3.setState(_objectSpread2({}, resetResultSetOnChange ? {
          resultSet: null
        } : {}, {
          error: error,
          isLoading: false
        }));
      });
    }
  }, {
    key: "render",
    value: function render() {
      var _this$state = this.state,
          error = _this$state.error,
          queries = _this$state.queries,
          resultSet = _this$state.resultSet,
          isLoading = _this$state.isLoading,
          sqlQuery = _this$state.sqlQuery;
      var render = this.props.render;
      var loadState = {
        error: error,
        resultSet: queries ? resultSet || {} : resultSet,
        loadingState: {
          isLoading: isLoading
        },
        sqlQuery: sqlQuery
      };

      if (render) {
        return render(loadState);
      }

      return null;
    }
  }]);

  return QueryRenderer;
}(React__default.Component);
QueryRenderer.contextType = CubeContext;
QueryRenderer.propTypes = {
  render: PropTypes.func,
  cubejsApi: PropTypes.object,
  query: PropTypes.object,
  queries: PropTypes.object,
  loadSql: PropTypes.any,
  resetResultSetOnChange: PropTypes.bool,
  updateOnlyOnStateChange: PropTypes.bool
};
QueryRenderer.defaultProps = {
  cubejsApi: null,
  query: null,
  render: null,
  queries: null,
  loadSql: null,
  updateOnlyOnStateChange: false,
  resetResultSetOnChange: true
};

var QueryRendererWithTotals = function QueryRendererWithTotals(_ref) {
  var query = _ref.query,
      restProps = _objectWithoutProperties(_ref, ["query"]);

  return React__default.createElement(QueryRenderer, _extends({
    queries: {
      totals: _objectSpread2({}, query, {
        dimensions: [],
        timeDimensions: query.timeDimensions ? query.timeDimensions.map(function (td) {
          return _objectSpread2({}, td, {
            granularity: null
          });
        }) : undefined
      }),
      main: query
    }
  }, restProps));
};

QueryRendererWithTotals.propTypes = {
  render: PropTypes.func,
  cubejsApi: PropTypes.object.isRequired,
  query: PropTypes.object,
  queries: PropTypes.object,
  loadSql: PropTypes.any
};
QueryRendererWithTotals.defaultProps = {
  query: null,
  render: null,
  queries: null,
  loadSql: null
};

function moveKeyAtIndex(object, key, atIndex) {
  var keys = Object.keys(object);
  var entries = [];
  var index = 0;
  var j = 0;

  while (j < keys.length) {
    if (entries.length === atIndex) {
      entries.push([key, object[key]]);
      j++;
    } else {
      if (keys[index] !== key) {
        entries.push([keys[index], object[keys[index]]]);
        j++;
      }

      index++;
    }
  }
}

var granularities = [{
  name: undefined,
  title: 'w/o grouping'
}, {
  name: 'hour',
  title: 'Hour'
}, {
  name: 'day',
  title: 'Day'
}, {
  name: 'week',
  title: 'Week'
}, {
  name: 'month',
  title: 'Month'
}, {
  name: 'year',
  title: 'Year'
}];

var QueryBuilder =
/*#__PURE__*/
function (_React$Component) {
  _inherits(QueryBuilder, _React$Component);

  function QueryBuilder(props) {
    var _this;

    _classCallCheck(this, QueryBuilder);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(QueryBuilder).call(this, props));
    _this.state = _objectSpread2({
      query: props.query,
      chartType: 'line',
      orderMembers: []
    }, props.vizState);
    _this.shouldApplyHeuristicOrder = false;
    _this.requestId = 0;
    return _this;
  }

  _createClass(QueryBuilder, [{
    key: "componentDidMount",
    value: function () {
      var _componentDidMount = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee() {
        var _this2 = this;

        var query, meta, getInitialOrderMembers;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                query = this.state.query;
                _context.next = 3;
                return this.cubejsApi().meta();

              case 3:
                meta = _context.sent;

                getInitialOrderMembers = function getInitialOrderMembers() {
                  var indexById = Object.fromEntries(Object.keys(query.order || {}).map(function (id, index) {
                    return [id, index];
                  }));
                  return _this2.getOrderMembers().sort(function (a, b) {
                    var a1 = indexById[a.id] === undefined ? Number.MAX_SAFE_INTEGER : indexById[a.id];
                    var b1 = indexById[b.id] === undefined ? Number.MAX_SAFE_INTEGER : indexById[b.id];
                    return a1 - b1;
                  });
                };

                this.setState({
                  meta: meta
                }, function () {
                  _this2.setState({
                    orderMembers: getInitialOrderMembers()
                  });
                });

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function componentDidMount() {
        return _componentDidMount.apply(this, arguments);
      }

      return componentDidMount;
    }()
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
      var _this$props = this.props,
          query = _this$props.query,
          vizState = _this$props.vizState;

      if (!ramda.equals(prevProps.query, query)) {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState({
          query: query
        });
      }

      if (!ramda.equals(prevProps.vizState, vizState)) {
        // eslint-disable-next-line react/no-did-update-set-state
        this.setState(vizState);
      }

      if (!ramda.equals(prevState.query, this.state.query)) {
        var _this$state = this.state,
            _query = _this$state.query,
            orderMembers = _this$state.orderMembers;
        var indexedOrderMembers = ramda.indexBy(ramda.prop('id'), this.getOrderMembers());
        var currentIndexedOrderMembers = orderMembers.map(function (m) {
          return m.id;
        });
        var nextOrderMembers = orderMembers.map(function (orderMember) {
          return _objectSpread2({}, orderMember, {
            order: _query.order && _query.order[orderMember.id] || 'none'
          });
        }).filter(function (_ref) {
          var id = _ref.id;
          return Boolean(indexedOrderMembers[id]);
        });
        Object.entries(indexedOrderMembers).forEach(function (_ref2) {
          var _ref3 = _slicedToArray(_ref2, 2),
              id = _ref3[0],
              orderMember = _ref3[1];

          if (!currentIndexedOrderMembers.includes(id)) {
            nextOrderMembers.push(orderMember);
          }
        });

        var adjustedOrder = function adjustedOrder(query) {
          var orderMembers = [].concat(_toConsumableArray(query.measures || []), _toConsumableArray(query.dimensions || []), _toConsumableArray((query.timeDimensions || []).map(function (td) {
            return td.dimension;
          })));
          var order = Object.fromEntries(Object.entries(query.order || {}).map(function (_ref4) {
            var _ref5 = _slicedToArray(_ref4, 2),
                member = _ref5[0],
                order = _ref5[1];

            return orderMembers.includes(member) ? [member, order] : false;
          }).filter(Boolean));
          return query.order == null && !Object.keys(order).length || !orderMembers.length ? null : order;
        };

        var order = adjustedOrder(_query);

        var _ = _query.order,
            nextQuery = _objectWithoutProperties(_query, ["order"]);

        this.updateVizState({
          query: _objectSpread2({}, nextQuery, {}, order ? {
            order: order
          } : {}),
          orderMembers: nextOrderMembers
        });
      }
    }
  }, {
    key: "cubejsApi",
    value: function cubejsApi() {
      var cubejsApi = this.props.cubejsApi; // eslint-disable-next-line react/destructuring-assignment

      return cubejsApi || this.context && this.context.cubejsApi;
    }
  }, {
    key: "isQueryPresent",
    value: function isQueryPresent() {
      var query = this.state.query;
      return QueryRenderer.isQueryPresent(query);
    }
  }, {
    key: "getOrderMembers",
    value: function getOrderMembers() {
      var query = this.state.query;

      var toOrderMember = function toOrderMember(member) {
        return {
          id: member.name,
          title: member.title
        };
      };

      return ramda.uniqBy(ramda.prop('id'), [].concat(_toConsumableArray(this.resolveMember('measures').map(toOrderMember)), _toConsumableArray(this.resolveMember('dimensions').map(toOrderMember)), _toConsumableArray(this.resolveMember('timeDimensions').map(function (td) {
        return toOrderMember(td.dimension);
      }))).map(function (member) {
        return _objectSpread2({}, member, {
          order: query.order && query.order[member.id] || 'none'
        });
      }));
    }
  }, {
    key: "resolveMember",
    value: function resolveMember(type) {
      var _this$state2 = this.state,
          meta = _this$state2.meta,
          query = _this$state2.query;

      if (!meta) {
        return [];
      }

      if (type === 'timeDimensions') {
        return (query.timeDimensions || []).map(function (m, index) {
          return _objectSpread2({}, m, {
            dimension: _objectSpread2({}, meta.resolveMember(m.dimension, 'dimensions'), {
              granularities: granularities
            }),
            index: index
          });
        });
      }

      return (query[type] || []).map(function (m, index) {
        return _objectSpread2({
          index: index
        }, meta.resolveMember(m, type));
      });
    }
  }, {
    key: "prepareRenderProps",
    value: function prepareRenderProps(queryRendererProps) {
      var _this3 = this;

      var getName = function getName(member) {
        return member.name;
      };

      var toTimeDimension = function toTimeDimension(member) {
        return {
          dimension: member.dimension.name,
          granularity: member.granularity,
          dateRange: member.dateRange
        };
      };

      var toFilter = function toFilter(member) {
        return {
          dimension: member.dimension.name,
          operator: member.operator,
          values: member.values
        };
      };

      var updateMethods = function updateMethods(memberType) {
        var toQuery = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : getName;
        return {
          add: function add(member) {
            var query = _this3.state.query;

            _this3.updateQuery(_defineProperty({}, memberType, (query[memberType] || []).concat(toQuery(member))));
          },
          remove: function remove(member) {
            var query = _this3.state.query;
            var members = (query[memberType] || []).concat([]);
            members.splice(member.index, 1);
            return _this3.updateQuery(_defineProperty({}, memberType, members));
          },
          update: function update(member, updateWith) {
            var query = _this3.state.query;
            var members = (query[memberType] || []).concat([]);
            members.splice(member.index, 1, toQuery(updateWith));
            return _this3.updateQuery(_defineProperty({}, memberType, members));
          }
        };
      };

      var self = this;
      var _this$state3 = this.state,
          meta = _this$state3.meta,
          query = _this$state3.query,
          _this$state3$orderMem = _this$state3.orderMembers,
          orderMembers = _this$state3$orderMem === void 0 ? [] : _this$state3$orderMem,
          chartType = _this$state3.chartType;
      return _objectSpread2({
        meta: meta,
        query: query,
        validatedQuery: this.validatedQuery(),
        isQueryPresent: this.isQueryPresent(),
        chartType: chartType,
        measures: this.resolveMember('measures'),
        dimensions: this.resolveMember('dimensions'),
        timeDimensions: this.resolveMember('timeDimensions'),
        segments: (meta && query.segments || []).map(function (m, i) {
          return _objectSpread2({
            index: i
          }, meta.resolveMember(m, 'segments'));
        }),
        filters: (meta && query.filters || []).map(function (m, i) {
          return _objectSpread2({}, m, {
            dimension: meta.resolveMember(m.dimension, ['dimensions', 'measures']),
            operators: meta.filterOperatorsForMember(m.dimension, ['dimensions', 'measures']),
            index: i
          });
        }),
        orderMembers: orderMembers,
        availableMeasures: meta && meta.membersForQuery(query, 'measures') || [],
        availableDimensions: meta && meta.membersForQuery(query, 'dimensions') || [],
        availableTimeDimensions: (meta && meta.membersForQuery(query, 'dimensions') || []).filter(function (m) {
          return m.type === 'time';
        }),
        availableSegments: meta && meta.membersForQuery(query, 'segments') || [],
        updateMeasures: updateMethods('measures'),
        updateDimensions: updateMethods('dimensions'),
        updateSegments: updateMethods('segments'),
        updateTimeDimensions: updateMethods('timeDimensions', toTimeDimension),
        updateFilters: updateMethods('filters', toFilter),
        updateChartType: function updateChartType(newChartType) {
          return _this3.updateVizState({
            chartType: newChartType
          });
        },
        updateOrder: {
          set: function set(member) {
            var order = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'asc';
            var atIndex = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : null;

            if (order === 'none') {
              this.remove(member);
            }

            var nextOrder;

            if (atIndex !== null) {
              nextOrder = moveKeyAtIndex(query.order, member, atIndex);
              nextOrder[member] = order;
            } else {
              nextOrder = _objectSpread2({}, query.order, _defineProperty({}, member, order));
            }

            self.updateQuery({
              order: nextOrder
            });
          },
          remove: function remove(member) {
            _this3.updateQuery({
              order: Object.keys(query.order).filter(function (currentMember) {
                return currentMember !== member;
              }).reduce(function (memo, currentMember) {
                memo[currentMember] = query.order[currentMember];
                return memo;
              }, {})
            });
          },
          update: function update(order) {
            _this3.updateQuery({
              order: order
            });
          },
          updateByOrderMembers: function updateByOrderMembers() {
            var orderMembers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

            _this3.setState({
              orderMembers: orderMembers
            });

            _this3.updateQuery({
              order: Object.fromEntries(orderMembers.map(function (_ref6) {
                var id = _ref6.id,
                    order = _ref6.order;
                return order !== 'none' && [id, order];
              }).filter(Boolean)) || {}
            });
          }
        }
      }, queryRendererProps);
    }
  }, {
    key: "updateQuery",
    value: function updateQuery(queryUpdate) {
      var query = this.state.query;
      this.updateVizState({
        query: _objectSpread2({}, query, {}, queryUpdate)
      });
    }
  }, {
    key: "updateVizState",
    value: function () {
      var _updateVizState = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee2(state) {
        var _this$props2, setQuery, setVizState, finalState, currentRequestId, _finalState$query, _, _query2, _ref7, sqlQuery, _finalState, meta, toSet;

        return _regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _this$props2 = this.props, setQuery = _this$props2.setQuery, setVizState = _this$props2.setVizState;
                finalState = this.applyStateChangeHeuristics(state);

                if (!this.shouldApplyHeuristicOrder) {
                  _context2.next = 16;
                  break;
                }

                _context2.prev = 3;
                currentRequestId = ++this.requestId;
                _finalState$query = finalState.query, _ = _finalState$query.order, _query2 = _objectWithoutProperties(_finalState$query, ["order"]);
                _context2.next = 8;
                return this.cubejsApi().sql(_query2);

              case 8:
                _ref7 = _context2.sent;
                sqlQuery = _ref7.sqlQuery;

                if (this.requestId === currentRequestId) {
                  finalState = _objectSpread2({}, finalState, {
                    query: _objectSpread2({}, finalState.query, {
                      order: sqlQuery.sql.order
                    })
                  });
                }

                _context2.next = 15;
                break;

              case 13:
                _context2.prev = 13;
                _context2.t0 = _context2["catch"](3);

              case 15:
                this.shouldApplyHeuristicOrder = false;

              case 16:
                this.setState(finalState);
                finalState = _objectSpread2({}, this.state, {}, finalState);

                if (setQuery) {
                  setQuery(finalState.query);
                }

                if (setVizState) {
                  _finalState = finalState, meta = _finalState.meta, toSet = _objectWithoutProperties(_finalState, ["meta"]);
                  setVizState(toSet);
                }

              case 20:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[3, 13]]);
      }));

      function updateVizState(_x) {
        return _updateVizState.apply(this, arguments);
      }

      return updateVizState;
    }()
  }, {
    key: "validatedQuery",
    value: function validatedQuery() {
      var query = this.state.query;
      return _objectSpread2({}, query, {
        filters: (query.filters || []).filter(function (f) {
          return f.operator;
        })
      });
    }
  }, {
    key: "defaultHeuristics",
    value: function defaultHeuristics(newState) {
      var _this$state4 = this.state,
          query = _this$state4.query,
          sessionGranularity = _this$state4.sessionGranularity;
      var defaultGranularity = sessionGranularity || 'day';

      if (newState.query) {
        var oldQuery = query;
        var newQuery = newState.query;
        var meta = this.state.meta;

        if ((oldQuery.timeDimensions || []).length === 1 && (newQuery.timeDimensions || []).length === 1 && newQuery.timeDimensions[0].granularity && oldQuery.timeDimensions[0].granularity !== newQuery.timeDimensions[0].granularity) {
          newState = _objectSpread2({}, newState, {
            sessionGranularity: newQuery.timeDimensions[0].granularity
          });
        }

        if ((oldQuery.measures || []).length === 0 && (newQuery.measures || []).length > 0 || (oldQuery.measures || []).length === 1 && (newQuery.measures || []).length === 1 && oldQuery.measures[0] !== newQuery.measures[0]) {
          var defaultTimeDimension = meta.defaultTimeDimensionNameFor(newQuery.measures[0]);
          newQuery = _objectSpread2({}, newQuery, {
            timeDimensions: defaultTimeDimension ? [{
              dimension: defaultTimeDimension,
              granularity: defaultGranularity
            }] : []
          });
          this.shouldApplyHeuristicOrder = true;
          return _objectSpread2({}, newState, {
            query: newQuery,
            chartType: defaultTimeDimension ? 'line' : 'number'
          });
        }

        if ((oldQuery.dimensions || []).length === 0 && (newQuery.dimensions || []).length > 0) {
          newQuery = _objectSpread2({}, newQuery, {
            timeDimensions: (newQuery.timeDimensions || []).map(function (td) {
              return _objectSpread2({}, td, {
                granularity: undefined
              });
            })
          });
          this.shouldApplyHeuristicOrder = true;
          return _objectSpread2({}, newState, {
            query: newQuery,
            chartType: 'table'
          });
        }

        if ((oldQuery.dimensions || []).length > 0 && (newQuery.dimensions || []).length === 0) {
          newQuery = _objectSpread2({}, newQuery, {
            timeDimensions: (newQuery.timeDimensions || []).map(function (td) {
              return _objectSpread2({}, td, {
                granularity: td.granularity || defaultGranularity
              });
            })
          });
          this.shouldApplyHeuristicOrder = true;
          return _objectSpread2({}, newState, {
            query: newQuery,
            chartType: (newQuery.timeDimensions || []).length ? 'line' : 'number'
          });
        }

        if (((oldQuery.dimensions || []).length > 0 || (oldQuery.measures || []).length > 0) && (newQuery.dimensions || []).length === 0 && (newQuery.measures || []).length === 0) {
          newQuery = _objectSpread2({}, newQuery, {
            timeDimensions: [],
            filters: []
          });
          this.shouldApplyHeuristicOrder = true;
          return _objectSpread2({}, newState, {
            query: newQuery,
            sessionGranularity: null
          });
        }

        return newState;
      }

      if (newState.chartType) {
        var newChartType = newState.chartType;

        if ((newChartType === 'line' || newChartType === 'area') && (query.timeDimensions || []).length === 1 && !query.timeDimensions[0].granularity) {
          var _query$timeDimensions = _slicedToArray(query.timeDimensions, 1),
              td = _query$timeDimensions[0];

          return _objectSpread2({}, newState, {
            query: _objectSpread2({}, query, {
              timeDimensions: [_objectSpread2({}, td, {
                granularity: defaultGranularity
              })]
            })
          });
        }

        if ((newChartType === 'pie' || newChartType === 'table' || newChartType === 'number') && (query.timeDimensions || []).length === 1 && query.timeDimensions[0].granularity) {
          var _query$timeDimensions2 = _slicedToArray(query.timeDimensions, 1),
              _td = _query$timeDimensions2[0];

          return _objectSpread2({}, newState, {
            query: _objectSpread2({}, query, {
              timeDimensions: [_objectSpread2({}, _td, {
                granularity: undefined
              })]
            })
          });
        }
      }

      return newState;
    }
  }, {
    key: "applyStateChangeHeuristics",
    value: function applyStateChangeHeuristics(newState) {
      var _this$props3 = this.props,
          stateChangeHeuristics = _this$props3.stateChangeHeuristics,
          disableHeuristics = _this$props3.disableHeuristics;

      if (disableHeuristics) {
        return newState;
      }

      return stateChangeHeuristics && stateChangeHeuristics(this.state, newState) || this.defaultHeuristics(newState);
    }
  }, {
    key: "render",
    value: function render() {
      var _this4 = this;

      var _this$props4 = this.props,
          cubejsApi = _this$props4.cubejsApi,
          _render = _this$props4.render,
          wrapWithQueryRenderer = _this$props4.wrapWithQueryRenderer;

      if (wrapWithQueryRenderer) {
        return React__default.createElement(QueryRenderer, {
          query: this.validatedQuery(),
          cubejsApi: cubejsApi,
          render: function render(queryRendererProps) {
            if (_render) {
              return _render(_this4.prepareRenderProps(queryRendererProps));
            }

            return null;
          }
        });
      } else {
        if (_render) {
          return _render(this.prepareRenderProps());
        }

        return null;
      }
    }
  }]);

  return QueryBuilder;
}(React__default.Component);
QueryBuilder.contextType = CubeContext;
QueryBuilder.propTypes = {
  render: PropTypes.func,
  stateChangeHeuristics: PropTypes.func,
  setQuery: PropTypes.func,
  setVizState: PropTypes.func,
  cubejsApi: PropTypes.object,
  disableHeuristics: PropTypes.bool,
  wrapWithQueryRenderer: PropTypes.bool,
  query: PropTypes.object,
  vizState: PropTypes.object
};
QueryBuilder.defaultProps = {
  cubejsApi: null,
  query: {},
  setQuery: null,
  setVizState: null,
  stateChangeHeuristics: null,
  disableHeuristics: false,
  render: null,
  wrapWithQueryRenderer: true,
  vizState: {}
};

var CubeProvider = function CubeProvider(_ref) {
  var cubejsApi = _ref.cubejsApi,
      children = _ref.children;
  return React__default.createElement(CubeContext.Provider, {
    value: {
      cubejsApi: cubejsApi
    }
  }, children);
};

CubeProvider.propTypes = {
  cubejsApi: PropTypes.object.isRequired,
  children: PropTypes.any.isRequired
};

function useDeepCompareMemoize(value) {
  var ref = React.useRef([]);

  if (!ramda.equals(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

var useCubeQuery = (function (query) {
  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var mutexRef = React.useRef({});

  var _useState = React.useState(null),
      _useState2 = _slicedToArray(_useState, 2),
      currentQuery = _useState2[0],
      setCurrentQuery = _useState2[1];

  var _useState3 = React.useState(false),
      _useState4 = _slicedToArray(_useState3, 2),
      isLoading = _useState4[0],
      setLoading = _useState4[1];

  var _useState5 = React.useState(null),
      _useState6 = _slicedToArray(_useState5, 2),
      resultSet = _useState6[0],
      setResultSet = _useState6[1];

  var _useState7 = React.useState(null),
      _useState8 = _slicedToArray(_useState7, 2),
      error = _useState8[0],
      setError = _useState8[1];

  var context = React.useContext(CubeContext);
  var subscribeRequest = null;
  React.useEffect(function () {
    var _options$skip = options.skip,
        skip = _options$skip === void 0 ? false : _options$skip,
        resetResultSetOnChange = options.resetResultSetOnChange;

    function loadQuery() {
      return _loadQuery.apply(this, arguments);
    }

    function _loadQuery() {
      _loadQuery = _asyncToGenerator(
      /*#__PURE__*/
      _regeneratorRuntime.mark(function _callee() {
        var cubejsApi;
        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                if (!(!skip && query && isQueryPresent(query))) {
                  _context.next = 25;
                  break;
                }

                if (!ramda.equals(currentQuery, query)) {
                  if (resetResultSetOnChange == null || resetResultSetOnChange) {
                    setResultSet(null);
                  }

                  setError(null);
                  setCurrentQuery(query);
                }

                setLoading(true);
                _context.prev = 3;

                if (!subscribeRequest) {
                  _context.next = 8;
                  break;
                }

                _context.next = 7;
                return subscribeRequest.unsubscribe();

              case 7:
                subscribeRequest = null;

              case 8:
                cubejsApi = options.cubejsApi || context && context.cubejsApi;

                if (!options.subscribe) {
                  _context.next = 13;
                  break;
                }

                subscribeRequest = cubejsApi.subscribe(query, {
                  mutexObj: mutexRef.current,
                  mutexKey: 'query'
                }, function (e, result) {
                  if (e) {
                    setError(e);
                  } else {
                    setResultSet(result);
                  }

                  setLoading(false);
                });
                _context.next = 19;
                break;

              case 13:
                _context.t0 = setResultSet;
                _context.next = 16;
                return cubejsApi.load(query, {
                  mutexObj: mutexRef.current,
                  mutexKey: 'query'
                });

              case 16:
                _context.t1 = _context.sent;
                (0, _context.t0)(_context.t1);
                setLoading(false);

              case 19:
                _context.next = 25;
                break;

              case 21:
                _context.prev = 21;
                _context.t2 = _context["catch"](3);
                setError(_context.t2);
                setLoading(false);

              case 25:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[3, 21]]);
      }));
      return _loadQuery.apply(this, arguments);
    }

    loadQuery();
    return function () {
      if (subscribeRequest) {
        subscribeRequest.unsubscribe();
        subscribeRequest = null;
      }
    };
  }, useDeepCompareMemoize([query, options, context]));
  return {
    isLoading: isLoading,
    resultSet: resultSet,
    error: error
  };
});

exports.QueryRenderer = QueryRenderer;
exports.QueryRendererWithTotals = QueryRendererWithTotals;
exports.QueryBuilder = QueryBuilder;
exports.isQueryPresent = isQueryPresent;
exports.CubeContext = CubeContext;
exports.CubeProvider = CubeProvider;
exports.useCubeQuery = useCubeQuery;
