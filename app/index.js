(function(app, $) {
  function text_visualization(config) {
    $(".title").html(config.title);
    /* Rings */
    let ringsContainer = $("<div/>", { class: "rings-container" }).appendTo(
      $(".title")
    );
    for (let ring = 0; ring < config.rings.length; ring++) {
      let ringTitle = $("<label/>", {
        class: "ring-title",
        html: config.rings[ring].name
      });
      let ringDiv = $("<ul/>", {
        class: "ring ring" + ring,
        "data-ring": ring,
        html: ringTitle
      }).appendTo(ringsContainer);
    }
    /* Quadrants */
    let quadContainer = $("<div/>", { class: "quad-container" });
    for (let quad = 0; quad < config.quadrants.length; quad++) {
      let quadTitle = $("<span/>", {
        class: "quad-title",
        html: config.quadrants[quad].name
      });
      let quadDiv = $("<div/>", {
        class: "quad quad" + quad,
        "data-quad": quad,
        html: quadTitle
      }).appendTo(quadContainer);
    }
    $("#textual-data").html(quadContainer);
    $(".quad").append(ringsContainer);
  }
  function sortData(entries) {
    return entries.sort(function(a, b) {
      return a.label.localeCompare(b.label);
    });
  }

  function createFilterTags(entries) {
    /*saving all array of tags */
    let tags = [];
    $.each(entries, function(index, entry) {
      if (entry.platform) {
        let platforms = entry.platform.map(function(platform) {
          return platform.toLowerCase();
        });
        tags = tags.concat(platforms);
      }
    });
    let uniqueTags = [...new Set(tags)];
    return uniqueTags;
  }
  function generatefilterTemplate(filterTags) {
    let filterTitle = $("<span/>", { html: "Filter By Platforms" });
    let filterOptionsBox = $("<div/>", { class: "filter-options" }).append(
      filterTitle
    );
    $.each(filterTags, function(index, tag) {
      let inputBoxContainer = $("<div/>", { class: "filter-tags" }).appendTo(
        filterOptionsBox
      );
      $(inputBoxContainer).append(
        $("<input/>", {
          value: tag,
          type: "checkbox",
          name: "filter_tags",
          id: tag,
          checked: true
        })
      );
      $(inputBoxContainer).append(
        $("<label/>", {
          for: tag,
          text: tag
        })
      );
    });
    filterOptionsBox.appendTo($(".filter-box"));
  }
  function filterDataOnChange() {
    $(".filter-box input").on("change", function() {
      let filters = $(".filter-box input:checkbox:checked")
        .map(function() {
          return $(this).val();
        })
        .toArray();
      filterData(filters);
    });
  }
  function darkThemeToggle() {
    $('#js-dark-theme').on('click', function(){
      if($(this).text() === 'Dark theme') {
        $(this).text('Light theme');
      }
      else {
        $(this).text('Dark theme');
      }
      $('body').toggleClass('dark-theme');
      $('#radar').toggleClass('dark-theme');
    })
  }
  function filterData(filters) {
    if (filters.length === $(".filter-box input:checkbox").length) {
      $("#radar").html("");
      radar_visualization(app.data);
      return;
    }
    let filteredData = app.data.entries.filter(function(entry) {
      if (entry.platform) {
        return filters.some(function(filter) {
          let platforms = entry.platform.map(function(platform) {
            return platform.toLowerCase();
          });
          return platforms.includes(filter.toLowerCase());
        });
      }
    });
    let data = Object.assign({}, app.data);
    data.entries = filteredData;
    $("#radar").html("");
    radar_visualization(data);
    data = "";
  }
  $(document).ready(function() {
    $.getJSON("data")
      .done(function(data) {
        sortData(data.entries);
        app.data = data;
        text_visualization(data);
        radar_visualization(data);
        let uniqueTags = createFilterTags(data.entries);
        generatefilterTemplate(uniqueTags);
        filterDataOnChange();
        darkThemeToggle();
      })
      .fail(function(jqxhr, textStatus, error) {
        var err = textStatus + ", " + error;
        console.log("Request Failed: " + err);
      });
  });
})((window.app = window.app || {}), jQuery);
