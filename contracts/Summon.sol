pragma solidity ^0.4.17;

contract Hero {
	uint hp;
	uint atk;
	uint def;
	uint ID;
	//获取属性
	function getHp() public view returns(uint) {
		return hp;
	}
	function getAtk() public view returns(uint) {
		return atk;
	}
	function getDef() public view returns(uint) {
		return def;
	}
    
	//增加属性
	function addHp() public {
		++hp;
	}
	function addAtk() public {
		++atk;
	}
	function addDef() public {
		++def;
	}

}

contract Summoner {
	uint level;
	uint wins;
	uint heroId;
    function summon(uint heroID) public{
        heroId = heroID;
    }

    function getHero() public view returns(uint) {
        return heroId;
    }
}

contract Summon {

  Hero[16] public heros;  // 保存英雄的地址

    // 召唤英雄
  function summon(Summoner summoner, uint heroId) public returns (uint) {
    require(heroId >= 0 && heroId <= 15);  // 确保id在数组长度内
	
	summoner.summon(heroId);
	
    return heroId;
  }

  // 返回英雄
  function getHeros() public view returns (Hero[16]) {
    return heros;
  }

  function battle(Summoner summoner1, Summoner summoner2) public view returns (bool) {
	if (heros[summoner1.getHero()].getAtk() > heros[summoner2.getHero()].getAtk()) return true;
  }
  
  function addPoint(Summoner summoner) public {
	heros[summoner.getHero()].addHp();
	heros[summoner.getHero()].addAtk();
	heros[summoner.getHero()].addDef();
  }
}