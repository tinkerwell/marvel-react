/** @jsx React.DOM */
var React = require("react");
var DataGridWrapper = require('../jsx/datagridwrapper.jsx');
function useStatic(){
  var datagrid = <DataGridWrapper url='/api/hero'
    pollInterval={10000} />;
  React.render(
    datagrid,
    document.getElementById('datagrid')
  );

}


useStatic();
