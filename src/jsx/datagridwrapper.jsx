var React = require("react/addons");
var DataGrid = require('./datagrid.jsx');
//var DataRow = require('./datarow.jsx');


var DataGridWrapper = React.createClass({
  handleClicky: function(e){
    console.log( "handle clicky : " + e.detail.message );

  },

  loadDataFromServer: function(hasmore){
    var that = this;
    var url = this.props.url + "?limit=" + this.state.limit + "&offset=" + this.state.offset;
    var d = { limit : this.state.limit , offset : this.state.offset };
    $.ajax({
      url: url,
      dataType: 'json',
      success: function(res) {
        console.log( res.meta.count );
        var tn = _.pluck( res.data, "thumbnail");
        _.each(tn, function(v,k){
          v.src =  v.path + "/standard_fantastic." + v.extension;
        });
        this.setState({
          hero: this.state.hero.concat( res.data ),
          offset : this.state.offset + res.meta.count
        });

      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)

    });

  },
  showChildrenState: function(){
    //console.log( this.state.hero );
    console.log( this.state.selhero );
  },
  //handleRowSelected: function( rowIdx, prop, val){
  handleRowSelected: function( child ){
    var selhero = _.toArray(this.state.selhero);
    var ksk = _.toArray(this.state.hero);
    if( _.indexOf( selhero, child.props.hero.name  ) == -1 )
      selhero.push(child.props.hero.name);
    else{
      selhero =  _.without( selhero, child.props.hero.name  );
    }
    var hero = _.map(ksk, function( k ){
      if(  _.indexOf( selhero, k.name ) == -1 )
        k.selected = false;
      else
        k.selected = true;
      return k;
    });
    this.setState({selhero: selhero});
    this.setState({hero: hero});
  },
  getInitialState: function() {
    return {
      hero: [],
      selhero: [],
      limit : 12,
      offset : 0,
      totalPage : 0,
      currentPage : 0,
      hasmore : true
    };
  },
  componentDidMount: function() {
    this.loadDataFromServer();
    document.addEventListener('clicky', this.handleClicky );
  },
  render: function() {
    return (
        <div>
            <DataGrid hero={this.state.hero} onRowSelected={this.handleRowSelected}/>
            <button type="button" onClick={this.loadDataFromServer}>Load More Heroes</button>
        </div>
    );
  }
});

module.exports = DataGridWrapper;
