App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load heros.
    $.getJSON('../heros.json', function(data) {
      var herosRow = $('#herosRow');
      var heroTemplate = $('#heroTemplate');

      for (i = 0; i < data.length; i ++) {
        heroTemplate.find('.panel-title').text(data[i].name);
        heroTemplate.find('img').attr('src', data[i].picture);
        heroTemplate.find('.hero-hp').text(data[i].hp);
        heroTemplate.find('.hero-atk').text(data[i].atk);
        heroTemplate.find('.hero-def').text(data[i].def);
        heroTemplate.find('.btn-summon').attr('data-id', data[i].id);
		heroTemplate.find('.btn-battle').attr('data-id', data[i].id+16);
		heroTemplate.find('.btn-add').attr('data-id', data[i].id+32);
        herosRow.append(heroTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
    // Is there an injected web3 instance?
	if (typeof web3 !== 'undefined') {
		App.web3Provider = web3.currentProvider;
	} else {
	// If no injected web3 instance is detected, fall back to Ganache
		App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
	}
	web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    // 加载Summon.json，保存了Summon的ABI（接口说明）信息及部署后的网络(地址)信息，它在编译合约的时候生成ABI，在部署的时候追加网络信息
    $.getJSON('Summon.json', function(data) {
    // 用Summon.json数据创建一个可交互的TruffleContract合约实例。
    var SummonArtifact = data;
    App.contracts.Summon = TruffleContract(SummonArtifact);

    // Set the provider for our contract
    App.contracts.Summon.setProvider(App.web3Provider);

    // Use our contract to retrieve and mark the summoned heros
    return App.markSummoned();
  });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-summon', App.handleSummon);
  },

  markSummoned: function(adopters, account) {
    var summonInstance;

  App.contracts.Summon.deployed().then(function(instance) {
    summonInstance = instance;

    // 调用合约的getHeros(), 用call读取信息不用消耗gas
    return summonInstance.getHeros.call();
  }).then(function(adopters) {
    for (i = 0; i < adopters.length; i++) {
      if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
        $('.panel-hero').eq(i).find('button').text('Success').attr('disabled', true);
      }
    }
  }).catch(function(err) {
    console.log(err.message);
  });
  },

  handleSummon: function(event) {

    event.preventDefault();

  var heroId = parseInt($(event.target).data('id'));

  var summonInstance;

  // 获取用户账号
  web3.eth.getAccounts(function(error, accounts) {
    if (error) {
      console.log(error);
    }
  
    var account = accounts[0];
  
    App.contracts.Summon.deployed().then(function(instance) {
      summonInstance = instance;
  
      // 发送交易召唤英雄
      return summonInstance.summon(heroId, {from: account});
    }).then(function(result) {
      return App.markSummoned();
    }).catch(function(err) {
      console.log(err.message);
    });
  });
  }

  
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
