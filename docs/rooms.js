(() => {
  resetRooms();
  document.getElementById("reveal-all").onclick = resetRooms;

  let targetRoom;
  let savedScroll;
  let lastScroll = { y: window.scrollY,
                     x: window.scrollX };

  forEachRoom(img => img.tabIndex = 0);

  document.addEventListener("focus", evt => {
    if (evt.target === document) return;

    updateLocation(evt);
  }, true);
  document.addEventListener("click", updateLocation, true);

  function updateLocation(evt) {
    if (evt.target.id &&
        evt.target.localName === "img" &&
        evt.target.closest("#game-map") &&
        location.hash != "#" + evt.target.id) {
      selectTargetRoom(evt.target);
    } else if (location.hash.length > 1 &&
        location.hash != "#" + evt.target.id) {
      //setTimeout(() => selectTargetRoom(null));
      selectTargetRoom(null);
    }
  }

  document.addEventListener("scroll", updateLastScroll);
  document.addEventListener("scrollend", updateLastScroll);

  document.addEventListener("scroll", scrollTargetRoomIntoView);
  document.addEventListener("scrollend", scrollTargetRoomIntoView);
  window.addEventListener("hashchange", scrollTargetRoomIntoView);

  window.addEventListener("pageshow", () => {
    updateLastScroll();

    let hash = location.hash;
    if (hash.startsWith("#room-")) {
      focusRoom(hash.substring(1));
    }
  });

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("a[href^='#room-']").forEach(link => {
      link.onclick = evt => {
        let hash = evt.target.getAttribute("href");
        focusRoom(hash.substring(1));
        evt.preventDefault();
      };
    });
  });

  function focusRoom(id) {
      let room = document.getElementById(id);
      if (room) room.focus();
  }

  function selectTargetRoom(img) {
    //img.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
    if (savedScroll) {
      // Prevent scroll into view
    } else if (img) {
      savedScroll = { y: lastScroll.y,
                      x: lastScroll.x };
      targetRoom = img;
    } else {
      savedScroll = { y: window.scrollY,
                      x: window.scrollX };
    }
    location.replace("#" + (img ? img.id : ""));
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
