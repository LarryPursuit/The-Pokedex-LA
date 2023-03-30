class Pokemon {
  constructor(name, image, types, pokedexNumber, species, abilities, stats) {
    this.pokemonName = name;
    this.pokemonImageAddress = image;
    this.pokemonTypes = types;
    this.pokedexNumber = pokedexNumber;
    this.species = species;
    this.abilities = abilities;
    this.stats = stats;
    this.convertedStatList = {};
    this.region = null;
    this.summaryInfo = null;
    this.domElements = {
      displayText: $(".displayText"),
      displayImage: $(".displayImage"),
      basicInformation: $(".basicInformation"),
      basicInformationTitle: $(".basicInformationTitle"),
      basicInformationDisplay: $(".basicInformationDisplay"),
      baseStatsTitle: $(".baseStatsTitle"),
      baseStatsDisplay: $(".baseStatsDisplay"),
      summaryTitle: $(".summaryTitle"),
      summaryDisplay: $(".summaryDisplay"),
    };
    this.gotPokemonSpeciesInfo = this.gotPokemonSpeciesInfo.bind(this);
  }
  render() {
    this.domElements.displayText.text(this.pokemonName);
    this.domElements.displayImage.css(
      "background-image",
      "url(" + this.pokemonImageAddress + ")"
    );
    this.getPokemonSpeciesInfo();
  }

  renderSecondPage() {
    this.domElements.basicInformationTitle.text(this.region);
    let nationalDexNumber = $("<div>")
      .addClass("nationalDexNumber")
      .text("National Dex: ")
      .append("<span>" + this.pokedexNumber + "</span>");
    let typeArea = $("<div>").addClass("typeArea");
    for (let typeIndex = 0; typeIndex < this.pokemonTypes.length; typeIndex++) {
      let newTypeSpan = $("<span>")
        .addClass("type " + this.pokemonTypes[typeIndex])
        .text(this.pokemonTypes[typeIndex]);
      typeArea.append(newTypeSpan);
    }
    let species = $("<div>").addClass("species").text(this.species);
    let abilitiesTitle = $("<div>")
      .addClass("abilitiesTitle")
      .text("Abilities");
    let abilityList = $("<div>").addClass("abilities");
    for (
      let abilityIndex = 0;
      abilityIndex < this.abilities.length;
      abilityIndex++
    ) {
      let newAbilitySpan = $("<span>").text(this.abilities[abilityIndex] + " ");
      abilityList.append(newAbilitySpan);
    }
    this.domElements.basicInformationDisplay.append(
      nationalDexNumber,
      typeArea,
      species,
      abilitiesTitle,
      abilityList
    );
    this.domElements.basicInformationDisplay.css("background-image", "");
    this.convertStatsData();
  }

  renderThirdPage() {
    let statsTitleLookupTable = {
      attack: "Attack: ",
      defense: "Defense: ",
      "special-attack": "Special Atk: ",
      "special-defense": "Special Def: ",
      speed: "Speed: ",
      hp: "HP: ",
    };
    this.domElements.baseStatsTitle.text("Base Stats");
    let statsTable = $("<div>").addClass("baseStatsTable");
    for (let key in this.convertedStatList) {
      let statToAppend = $("<div>")
        .addClass(key)
        .text(statsTitleLookupTable[key])
        .append("<span>" + this.convertedStatList[key] + "</span>");
      statsTable.prepend(statToAppend);
    }
    this.domElements.baseStatsDisplay.append(statsTable);
    this.domElements.baseStatsDisplay.css("background-image", "");
    this.renderFourthPage();
  }
  renderFourthPage() {
    this.domElements.summaryTitle.text("Summary");
    let summaryInfo = $("<div>").addClass("summaryInfo").text(this.summaryInfo);
    this.domElements.summaryDisplay.append(summaryInfo);
    this.domElements.summaryDisplay.css("background-image", "");
  }
  getPokemonSpeciesInfo() {
    let speciesRequest = {
      url: this.species,
      success: this.gotPokemonSpeciesInfo,
    };
    $.ajax(speciesRequest);
  }
  gotPokemonSpeciesInfo(data) {
    let englishCheck = /^[A-Za-z0-9\s.!,?’é]*$/;
    this.species = data.genera[2].genus;
    this.abilities = this.abilities.map(function (ability) {
      return ability.ability.name;
    });
    this.pokemonTypes = this.pokemonTypes.map(function (types) {
      return types.type.name;
    });
    this.region = data.generation.name;
    let regionConversion = {
      "generation-i": "Kanto Region",
      "generation-ii": "Johto Region",
      "generation-iii": "Hoenn Region",
      "generation-iv": "Sinnoh Region",
      "generation-v": "Unova Region",
      "generation-vi": "Kalos Region",
      "generation-vii": "Alola Region",
      "generation-viii": "Galar Region",
    };
    if (regionConversion.hasOwnProperty(this.region)) {
      this.region = regionConversion[this.region];
    }

    if (englishCheck.test(data.flavor_text_entries[1].flavor_text)) {
      this.summaryInfo = data.flavor_text_entries[1].flavor_text;
    } else {
      for (
        let summaryIndex = 0;
        summaryIndex < data.flavor_text_entries.length;
        summaryIndex++
      ) {
        if (
          englishCheck.test(data.flavor_text_entries[summaryIndex].flavor_text)
        ) {
          this.summaryInfo = data.flavor_text_entries[summaryIndex].flavor_text;
          break;
        }
      }
    }
    this.renderSecondPage();
  }
  convertStatsData() {
    for (let statIndex = 0; statIndex < this.stats.length; statIndex++) {
      let statName = this.stats[statIndex].stat.name;
      let statValue = this.stats[statIndex].base_stat;
      this.convertedStatList[statName] = statValue;
    }
    this.renderThirdPage();
  }
}
