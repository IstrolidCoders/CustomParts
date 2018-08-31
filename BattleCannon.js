  
//Battle Cannon V1.0, huge thanks to R26 for the image loader script
/*
 * Load images into atlas so it can be drawn using `atlas.drawSpirte()`
 *
 * Use imgloader.addImage(name, url) to add images you want to load
 * Use imgloader.combineImages() after adding all the images
 * Now you can use atlas.drawSpirte(name, pos, size, rot, color) to draw the image
 */
var imgloader = {

    resizeFactor: 2,
    newAtlases: [],
    loading: 0,

    addImage(name, src) {
        var img = new Image();
        img.onload = function() {
            imgloader.newAtlases.push({
                name: name,
                img: img
            });
            imgloader.loading--;
        };
        img.onerror = function(e) {
            console.log("Could not load image", e);
            imgloader.loading--;
        };
        img.src = src;

        imgloader.loading++;
    },

    combineImages: function() {
        if(imgloader.loading > 0) {
            setTimeout(imgloader.combineImages, 50);
            return;
        }

        console.log("Adding images to atlas");

        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');

        var newSize = imgloader.origAtlas.size * imgloader.resizeFactor;
        canvas.width = canvas.height = newSize;

        for(let i in imgloader.origAtlas.mappings) {
            for(let j = 0; j < 4; j++) {
                atlas.mappings[i].uv[j] = imgloader.origAtlas.mappings[i].uv[j] / imgloader.resizeFactor;
            }
        }

        ctx.drawImage(imgloader.origAtlasImg, 0, canvas.height - imgloader.origAtlas.size);

        let x = 0;
        let y = 0;
        let maxH = 0;
        for(let a of imgloader.newAtlases) {
            if(x + a.img.width > newSize && maxH > 0) {
                x = 0;
                y += maxH;
                maxH = 0;
            }
            ctx.drawImage(a.img, x, y);
            atlas.mappings[a.name] = {};
            atlas.mappings[a.name].uv = [
                x / newSize,
                1 - y / newSize,
                (x + a.img.width) / newSize,
                1 - (y + a.img.height) / newSize
            ];
            x += a.img.width;
            maxH = Math.max(a.img.height, maxH);
        }

        atlas.src = canvas.toDataURL("image/png");
        baseAtlas.originalTextureSize = baseAtlas.textureSize = atlas.size = newSize;
        baseAtlas.loadAtlas(atlas);
    }
}

imgloader.origAtlas = Object.assign({}, atlas);
// Copy mappings
imgloader.origAtlas.mappings = {};
for(let i in atlas.mappings) {
    imgloader.origAtlas.mappings[i] = {};
    imgloader.origAtlas.mappings[i].uv = atlas.mappings[i].uv.slice();
}

imgloader.origAtlasImg = new Image();
imgloader.origAtlasImg.src = atlas.src;

imgloader.addImage("parts/turBattleCannon.png","https://i.imgur.com/0dbutRM.png");
imgloader.addImage("parts/turBattleCannonReload.png","https://i.imgur.com/7GdXAPu.png");
imgloader.combineImages();


//Battle Cannon
hasProp = {}.hasOwnProperty
extendz=function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; }
parts.BattleCannon = (function(superClass) {
    extendz(BattleCannon, superClass);
 
    function BattleCannon() {
      return BattleCannon.__super__.constructor.apply(this, arguments);
    }
 
  //  BulletSlowMod.prototype.id = 999;
 
    BattleCannon.prototype.name = "Battle Cannon";
 
    BattleCannon.prototype.desc = "Glory to PDables!";
 
    BattleCannon.prototype.cost = 5;
 
    BattleCannon.prototype.mass = 15;
 
    BattleCannon.prototype.hp = 10;
 
    BattleCannon.prototype.image = "turBattleCannon.png";

 
    BattleCannon.prototype.damage = 30*2;
 
    BattleCannon.prototype.reloadTime = 80;
 
   BattleCannon.prototype.shotEnergy = 2650;

     BattleCannon.prototype.bulletSpeed = 21.875;

     BattleCannon.prototype.size = [2, 2];

    BattleCannon.prototype.range = 900;

    BattleCannon.prototype.volley = 2;

      BattleCannon.prototype.fired = 2;
    BattleCannon.prototype.spread = [.01, -.01];

    

    BattleCannon.prototype.bulletCls = types.TorpBullet;

        BattleCannon.prototype.tick = function() {
      BattleCannon.__super__.tick.call(this);
      if (this.fired < 2) {
          this.rot += this.spread[0];
          this.makeRealBullet();
      
          this.rot += 2*this.spread[1];
          this.makeRealBullet();
		
        this.fired += 2;
        return this.working = true;
      }

      }
    ;

    BattleCannon.prototype.makeBullet = function(distance) {
      this.unit.cloak = 0;
      return this.fired = 0;
    };

    BattleCannon.prototype.makeRealBullet = function() {
      var particle;
      particle = new this.bulletCls();
      sim.things[particle.id] = particle;
      particle.side = this.unit.side;
      particle.life = 0;
      particle.dead = false;
      particle.z = this.unit.z + .001;
      particle.turretNum = this.turretNum;
      particle.origin = this.unit;
      particle.target = this.target;
      particle.speed = this.bulletSpeed;
      particle.damage = this.damage / 2;
      particle.maxLife = this.range / particle.speed * 1.5;
      v2.set(this.worldPos, particle.pos);
      v2.pointTo(particle.vel, this.rot);
      v2.scale(particle.vel, particle.speed);
      return particle.rot = this.rot;
    };
    return BattleCannon;
 
  })(parts.AutoTurret.__super__.constructor);
