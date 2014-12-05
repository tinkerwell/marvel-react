var api = require('marvel-api');

var marvel = api.createClient({
  publicKey: 'ae0730cc58984431c3ef197f6f10eacc'
, privateKey: 'e758db63116d494729308a3b1aa9dec62cc1b107'
});

marvel.characters.findAll()
  .then(function(res){
    console.log( res );
  })
  .fail(console.error)
  .done();
