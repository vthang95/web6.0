class ShipController {
    constructor(x, y, spriteName, configs) {
        this.sprite = Nakama.playerGroup.create(x, y, 'assets', spriteName);
        this.configs = configs;
        this.sprite.body.collideWorldBounds = true;
        this.timeSinceLastFire = 0;
        this.timeSinceLastHomingFire = 0;
        this.sprite.anchor = new Phaser.Point(0.5, 0.5);
        this.sprite.health = this.configs.health;

        Nakama.players.push(this);
        this.sprite.events.onKilled.add(this.remove, this);
    }

    remove() {
        Nakama.players.splice(Nakama.players.indexOf(this), 1);
    }

    tryFire() {
        if (this.timeSinceLastFire >= this.configs.cooldown) {
            this.fire();
            this.timeSinceLastFire = 0;
        }

        if (this.timeSinceLastHomingFire >= this.configs.cooldown + ShipController.DELAY_HOMING_BULLET) {
            this.homingFire();
            this.timeSinceLastHomingFire = 0;
        }

    }

    homingFire() {
        if (!this.sprite.alive) return;
        new HomingBulletController(
            this.sprite.position,
            new Phaser.Point(0, -1),
            'BulletType2Upgraded.png',
            Nakama.playerBulletGroup,
            Nakama.configs.player.homingBulletSpeed
        );
    }

    fire() {
        if (!this.sprite.alive) return;
        this.createBullet(new Phaser.Point(0, -1));
        // this.createBullet(new Phaser.Point(1, -3));
        // this.createBullet(new Phaser.Point(-1, -3));
        // this.createBullet(new Phaser.Point(1, -2));
        // this.createBullet(new Phaser.Point(-1, -2));
    }

    createBullet(direction) {
        new BulletController(
            this.sprite.position,
            direction,
            'BulletType1.png',
            Nakama.playerBulletGroup,
            1500,
            Math.atan(direction.x / -direction.y) * 180 / Math.PI
        );
    }

    update() {
        this.sprite.body.velocity.x = 0;
        this.sprite.body.velocity.y = 0;
        if (Nakama.keyboard.isDown(this.configs.up)) {
            this.sprite.body.velocity.y = -this.configs.shipSpeed;
        } else if (Nakama.keyboard.isDown(this.configs.down)) {
            this.sprite.body.velocity.y = this.configs.shipSpeed;
        }
        if (Nakama.keyboard.isDown(this.configs.left)) {
            this.sprite.body.velocity.x = -this.configs.shipSpeed;
        } else if (Nakama.keyboard.isDown(this.configs.right)) {
            this.sprite.body.velocity.x = this.configs.shipSpeed;
        }
        if (Nakama.keyboard.isDown(this.configs.fire)) {
            this.tryFire();
        }

        this.timeSinceLastFire += Nakama.game.time.physicsElapsed;
        this.timeSinceLastHomingFire += Nakama.game.time.physicsElapsed;
    }

    render() {
        // Nakama.game.debug.spriteInfo(this.sprite, 32, 100);
    }
}

ShipController.DELAY_HOMING_BULLET = 1;
