(() => {
  resetRooms();
  document.getElementById("reveal-all").onclick = resetRooms;

  let targetRoom;
  let savedScroll;
  let lastScroll = { y: window.scrollY,
                     x: window.scrollX };
  let backPos;

  forEachRoom(img => img.tabIndex = 0);

  document.addEventListener("focus", evt => {
    if (evt.target === document) return;

    updateLocation(evt);
  }, true);
  //document.addEventListener("click", evt => {
  //  updateLocation(evt);
  //}, true);

  function updateLocation(evt) {
    if (evt.target.id &&
        evt.target.localName === "img" &&
        evt.target.closest("#game-map") &&
        location.hash != "#" + evt.target.id) {
      selectTargetRoom(evt.target);
    } else if (location.hash.startsWith("#room-") &&
        location.hash != "#" + evt.target.id) {
      selectTargetRoom(null);
      evt.target.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
    }
  }

  //document.addEventListener("scroll", updateLastScroll);
  //document.addEventListener("scrollend", updateLastScroll);
  //
  //document.addEventListener("scroll", scrollTargetRoomIntoView);
  //document.addEventListener("scrollend", scrollTargetRoomIntoView);
  //window.addEventListener("hashchange", scrollTargetRoomIntoView);
  //
  //window.addEventListener("pageshow", () => {
  //  updateLastScroll();
  //
  //  let hash = location.hash;
  //  if (hash.startsWith("#room-")) {
  //    savedScroll = { y: window.scrollY,
  //                    x: window.scrollX };
  //    focusRoom(hash.substring(1));
  //  }
  //});

  document.body.addEventListener("click", evt => {
    let roomId = getRoomRef(evt.target);
    if (roomId) {
        focusRoom(roomId);
        evt.preventDefault();
    }
  }, true);

  function getRoomRef(elem) {
    let hash = elem.getAttribute("href");
    if (elem.localName == "a" && hash.startsWith("#room-")) {
      return hash.substring(1);
    }
  }

  let preview = document.getElementById("room-preview");
  let previewTrigger;
  let shiftKey = false;

  ["mouseover", "focus"].forEach(type => {
    document.body.addEventListener(type, evt => {
      let roomId = getRoomRef(evt.target);
      if (roomId) {
        preview.alt = roomId;
        updatePreviewSrc();

        // 256x192 - preview dimensions, 22 - text line height
        let vport = document.documentElement;
        let anchor = evt.target;
        let x = anchor.offsetLeft + Math.min(0,
            vport.clientWidth + vport.scrollLeft - anchor.offsetLeft - 256);
        let y = anchor.offsetTop;
        y += (y - vport.scrollTop + 192 + 22 > vport.clientHeight) ? -192 : 22;

        preview.style.position = "absolute";
        preview.style.top = y + "px";
        preview.style.left = x + "px";

        preview.style.display = "block";
        previewTrigger = anchor;
      } else if (previewTrigger != document.activeElement) {
        preview.style.display = "none";
      }
    }, true);
  });

  ["mousemove", "click"].forEach(type => {
    document.body.addEventListener(type, evt => {
      if (getRoomRef(evt.target)) return;

      if (previewTrigger != document.activeElement) {
        preview.style.display = "none";
      }
    });
  });

  function updatePreviewSrc() {
    if (preview.alt) {
      let reveal = document.getElementById("reveal-all").checked;
      let src = preview.alt + (reveal ^ shiftKey ? "-empty" : "") + ".png";
      if (!preview.src.endsWith(src)) preview.src = src;
    }
  }

  ["keydown", "keyup"].forEach(type => {
    document.body.addEventListener(type, evt => {
      if (evt.keyCode === 16) {
        shiftKey = (evt.type === "keydown");
        updatePreviewSrc();
      }
    });
  });

  document.body.addEventListener("keydown", evt => {
    if (evt.keyCode === 8 && backPos) {
      //if (backPos.focusElem) {
      //  backPos.focusElem.focus({ preventScroll: true });
      //  // The `preventScroll` option prevents the `scrollTo`
      //  // if attempted immediately.
      //  setTimeout(smoothScrollTo, 0, backPos.y, backPos.x);
      //} else {
      //  smoothScrollTo(backPos.y, backPos.x);
      //}
      //backPos = null;
    }

    function smoothScrollTo(y, x) {
      window.scrollTo({ top: y, left: x, behavior: "smooth" });
    }
  });

  function focusRoom(id) {
      let room = document.getElementById(id);
      if (room) {
        backPos = structuredClone(lastScroll);
        backPos.focusElem = document.activeElement;
        //room.focus({ preventScroll: true });
        room.focus({ smoothScroll: true });
      }
  }

  function selectTargetRoom(img) {
    ////img.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
    //if (savedScroll) {
    //  // Prevent scroll into view
    //} else if (img) {
    //  savedScroll = { y: lastScroll.y,
    //                  x: lastScroll.x };
    //  targetRoom = img;
    //} else {
    //  savedScroll = { y: window.scrollY,
    //                  x: window.scrollX };
    //}
    location.replace("#" + (img ? img.id : ""));
    if (img) {
      img.scrollIntoView({ behavior: "smooth", block: "center", inline: "center" });
    }
  }

  function updateLastScroll() {
    lastScroll.y = window.scrollY;
    lastScroll.x = window.scrollX;
  }

  function scrollTargetRoomIntoView() {
    if (savedScroll) {
      window.scrollTo({ top: savedScroll.y,
                        left: savedScroll.x,
                        behavior: "instant" });
      savedScroll = null;
    }
    if (targetRoom) {
      targetRoom.scrollIntoView({ block: "nearest",
                                  inline: "nearest",
                                  behavior: "smooth" });
      targetRoom = null;
    }
  }

  function resetRooms() {
    let empty = document.getElementById("reveal-all").checked;
    forEachRoom(img => img.src = img.alt + (empty ? "-empty" : "") + ".png");
  }

  function forEachRoom(imgFunc) {
    let map = document.getElementById("game-map");
    for (let img of map.getElementsByTagName("img")) {
      imgFunc(img);
    }
  }
})();
