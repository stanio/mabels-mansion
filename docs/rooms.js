(() => {
  resetRooms();
  document.getElementById("reveal-all").onclick = resetRooms;

  let targetRoom = { };
  forEachRoom(img => img.onclick = evt => selectTargetRoom(evt.target));

  window.addEventListener("scroll", scrollTargetRoomIntoView);
  window.addEventListener("hashchange", scrollTargetRoomIntoView);
  document.addEventListener("DOMContentLoaded", evt => {
    let hash = location.hash;
    if (hash.startsWith("#room-") &&
        window.scrollY === 0 && window.scrollX === 0) {
      targetRoom.origY = 0;
      targetRoom.origX = 0;
      targetRoom.img = document.getElementById(hash.substring(1));
    }

    document.querySelectorAll("a[href^='#room-']").forEach(link => {
      link.onclick = evt => {
        let hash = evt.target.getAttribute("href");
        selectTargetRoom(document.getElementById(hash.substring(1)));
        evt.preventDefault();
      };
    });
  });

  function selectTargetRoom(img) {
      //img.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "nearest" });
      targetRoom.origY = window.scrollY;
      targetRoom.origX = window.scrollX;
      targetRoom.img = img;

      // Doesn't update CSS :target
      //history.replaceState({}, "", "#" + img.id);
      location.replace("#" + img.id);
  }

  function scrollTargetRoomIntoView() {
    if (targetRoom.img) {
      window.scrollTo({ top: targetRoom.origY, left: targetRoom.origX, behavior: "instant" });
      targetRoom.img.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
      targetRoom.img = null;
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
