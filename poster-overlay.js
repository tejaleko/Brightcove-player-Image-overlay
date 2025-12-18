(function(videojs) {
  'use strict';

  var Plugin = videojs.getPlugin('plugin');

  var defaults = {
    poster: null,
    hideOnEvents: ['playing'],
    overlayClass: 'vjs-poster-overlay'
  };

  var PosterOverlay = videojs.extend(Plugin, {
    constructor: function(player, options) {
      Plugin.call(this, player, options);
      this.options = videojs.mergeOptions(defaults, options || {});
      this.overlayEl = null;
      this.posterImg = null;
      this.isHidden = false;

      this.onPlayerReady = videojs.bind(this, this.onPlayerReady);
      this.updatePoster = videojs.bind(this, this.updatePoster);
      this.hideOverlay = videojs.bind(this, this.hideOverlay);
      this.showOverlay = videojs.bind(this, this.showOverlay);

      if (player.isReady_) {
        this.onPlayerReady();
      } else {
        player.ready(this.onPlayerReady);
      }
    },

    onPlayerReady: function() {
      var player = this.player;
      this.buildOverlay();
      this.updatePoster();

      player.on('loadstart', this.showOverlay);
      player.on('loadedmetadata', this.updatePoster);

      var self = this;
      this.options.hideOnEvents.forEach(function(eventName) {
        player.on(eventName, self.hideOverlay);
      });

      player.on('dispose', function() {
        player.off('loadstart', self.showOverlay);
        player.off('loadedmetadata', self.updatePoster);
        self.options.hideOnEvents.forEach(function(eventName) {
          player.off(eventName, self.hideOverlay);
        });
      });
    },

    buildOverlay: function() {
      if (this.overlayEl) {
        return;
      }

      var player = this.player;
      var overlay = videojs.dom.createEl('div', {
        className: this.options.overlayClass
      });

      var img = videojs.dom.createEl('img', {
        className: this.options.overlayClass + '__image',
        alt: 'Livestream poster image'
      });

      overlay.appendChild(img);

      var controlBar = player.getChild('controlBar');
      if (controlBar && controlBar.el().parentNode === player.el()) {
        player.el().insertBefore(overlay, controlBar.el());
      } else {
        player.el().appendChild(overlay);
      }

      this.overlayEl = overlay;
      this.posterImg = img;
    },

    getPosterUrl: function() {
      if (this.options.poster) {
        return this.options.poster;
      }

      if (this.player.mediainfo && this.player.mediainfo.poster) {
        return this.player.mediainfo.poster;
      }

      if (typeof this.player.poster === 'function') {
        return this.player.poster();
      }

      return null;
    },

    updatePoster: function() {
      var posterUrl = this.getPosterUrl();
      if (!this.overlayEl) {
        this.buildOverlay();
      }

      if (posterUrl) {
        this.posterImg.setAttribute('src', posterUrl);
        this.overlayEl.classList.remove('is-hidden');
        this.isHidden = false;
      } else {
        this.hideOverlay();
      }
    },

    hideOverlay: function() {
      if (!this.overlayEl || this.isHidden) {
        return;
      }
      this.overlayEl.classList.add('is-hidden');
      this.isHidden = true;
    },

    showOverlay: function() {
      if (!this.overlayEl) {
        this.buildOverlay();
      }
      if (this.posterImg.getAttribute('src')) {
        this.overlayEl.classList.remove('is-hidden');
        this.isHidden = false;
      }
    }
  });

  videojs.registerPlugin('posterOverlay', PosterOverlay);
})(window.videojs);
