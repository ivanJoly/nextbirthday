function Picker(array, name, container, cb = null) {
  this.elements = array;
  this.id = name + "-" + Date.now();
  this.containerGeneral = container;

  this.create = function () {
    /* Container General */
    const containerGeneral = document.getElementById(this.containerGeneral);

    /* Container div */
    let container = document.createElement("div");
    container.setAttribute("id", this.id);
    container.classList.add("container-picker", "close");

    /* Button Up */
    let buttonUp = document.createElement("button");
    buttonUp.innerHTML = '<ion-icon name="arrow-dropup"></ion-icon>';
    buttonUp.classList.add("button-up", "container-picker-arrow", "top");

    buttonUp.onclick = (e) => this.up(e);

    /* Ul */
    let ul = document.createElement("ul");

    /* Button Down */
    let buttonDown = document.createElement("button");
    buttonDown.classList.add("button-down", "container-picker-arrow", "bottom");
    buttonDown.innerHTML = '<ion-icon name="arrow-dropdown"></ion-icon>';
    buttonDown.onclick = (e) => this.down(e);

    container.append(buttonUp);
    container.append(ul);
    container.append(buttonDown);

    /* 
        Recorrer el array + generar cada elemento + Append al UL
        */
    let tempArr = this.format(this.elements);

    tempArr.map((element, index) => {
      var li = document.createElement("li");
      var span = document.createElement("span");

      span.innerHTML = element;

      li.setAttribute("data-picker", element);
      li.setAttribute("data-scroll", index * 50);
      li.style.transform = `translateY(${index * 50}px)`;
      li.classList.add("picker-item");

      li.onclick = (e) => this.toggle(e);

      if (index === 5) {
        li.classList.add("selected");
      }

      li.append(span);
      ul.append(li);
    });

    /*Append al contenedor general */
    containerGeneral.append(container);
  };

  this.up = function () {
    let ulList;
    let container = document.getElementById(this.id);
    ulList = container.querySelector("ul");

    let i = 0;

    for (let child of ulList.children) {
      let scroll = child.getAttribute("data-scroll");
      child.setAttribute("data-scroll", Number(scroll) + 50);
      child.style.transform = `translateY(${Number(scroll) + 50}px)`;

      if (i === 4) {
        child.classList.add("selected");
      }

      if (i === 5) {
        child.classList.remove("selected");
      }

      i++;
    }

    let initialScroll = ulList.firstElementChild.getAttribute("data-scroll");
    let pick = ulList.lastElementChild.getAttribute("data-picker");

    let li = document.createElement("li");
    let span = document.createElement("span");

    span.innerHTML = pick;

    li.setAttribute("data-picker", pick);
    li.setAttribute("data-scroll", initialScroll - 50);
    li.style.transform = `translateY(${initialScroll - 50}px)`;
    li.classList.add("picker-item");

    li.onclick = (e) => this.toggle(e);

    li.append(span);
    ulList.prepend(li);

    ulList.removeChild(ulList.lastElementChild);

    this.update();
  };

  this.down = function () {
    let ulList;

    let container = document.getElementById(this.id);
    ulList = container.querySelector("ul");

    let i = 0;

    for (let child of ulList.children) {
      var scroll = child.getAttribute("data-scroll");
      child.setAttribute("data-scroll", Number(scroll) - 50);
      child.style.transform = `translateY(${Number(scroll) - 50}px)`;

      if (i === 5) {
        child.classList.remove("selected");
      }

      if (i === 6) {
        child.classList.add("selected");
      }

      i++;
    }

    var initialScroll = ulList.lastElementChild.getAttribute("data-scroll");
    var pick = ulList.firstElementChild.getAttribute("data-picker");

    var li = document.createElement("li");
    var span = document.createElement("span");

    span.innerHTML = pick;

    li.setAttribute("data-picker", pick);
    li.setAttribute("data-scroll", Number(initialScroll) + 50);
    li.style.transform = `translateY(${Number(initialScroll) + 50}px)`;
    li.classList.add("picker-item");

    li.onclick = (e) => this.toggle(e);

    li.append(span);
    ulList.append(li);

    ulList.removeChild(ulList.firstElementChild);

    this.update();
  };

  this.toggle = function (event) {
    if (event.target.classList.contains("selected")) {
      event.target.parentNode.parentNode.classList.toggle("open");
      return null;
    }

    if (!event.target.classList.contains("selected")) {
      var elSelected = event.target.parentNode.querySelector(
        ".picker-item.selected"
      );
      var scrollSelected = elSelected.dataset.scroll;
      var scroll = event.target.dataset.scroll;

      var valor = scroll - scrollSelected;
      if (valor == -100) {
        this.up();
        this.up();
      } else if (valor == -50) {
        this.up();
      } else if (valor == 50) {
        this.down();
      } else if (valor == 100) {
        this.down();
        this.down();
      }
    }

    this.update();
  };

  this.close = function () {
    let container = document.getElementById(this.id);
    container.classList.remove("open");
  };

  this.open = function () {
    let container = document.getElementById(this.id);
    container.classList.add("open");
  };

  this.update = function () {
    if (cb == null) {
      return null;
    }
    return cb(this.id);
  };

  this.refresh = function (array) {
    let ulList;
    let container = document.getElementById(this.id);
    ulList = container.querySelector("ul");
    ulList.innerHTML = "";

    array.map((element, index) => {
      var li = document.createElement("li");
      var span = document.createElement("span");

      span.innerHTML = element;

      li.setAttribute("data-picker", element);
      li.setAttribute("data-scroll", index * 50);
      li.style.transform = `translateY(${index * 50}px)`;
      li.classList.add("picker-item");

      li.onclick = (e) => this.toggle(e);

      if (index === 5) {
        li.classList.add("selected");
      }

      li.append(span);
      ulList.append(li);
    });
  };

  this.selected = function () {
    let container = document.getElementById(this.id);
    let selected = container
      .querySelector("ul li.picker-item.selected")
      .getAttribute("data-picker");
    return selected;
  };

  /* Funcion formateo de arrays */
  this.format = function (array, position = null) {
    /* Poder pasarle una posicion del array, y acomodarlo para esa pos v2.0*/

    let temp_arr = array;
    let formatArr = [];

    for (let index = 0; index < temp_arr.length; index++) {
      if (index <= 4) {
        formatArr.push(temp_arr[temp_arr.length - 5 + index]);
      } else {
        formatArr.push(temp_arr[index - 5]);
      }
    }

    return formatArr;
  };

  this.create();
}
