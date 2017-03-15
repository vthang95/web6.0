class ShipController {
    constructor(x, y, spriteName, configs) {
        this.sprite = Nakama.playerGroup.create(x, y, 'assets', spriteName);
        this.configs = configs;
        this.sprite.body.collideWorldBounds = true;
        this.SHIP_SPEED = 400;
        this.timeSinceLastFire = 0;
        this.sprite.anchor = new Phaser.Point(0.5, 0.5);
    }

    update() {
        this.sprite.body.velocity.x = 0;
        this.sprite.body.velocity.y = 0;
        if (Nakama.keyboard.isDown(this.configs.up)) {
            this.sprite.body.velocity.y = -this.SHIP_SPEED;
        } else if (Nakama.keyboard.isDown(this.configs.down)) {
            this.sprite.body.velocity.y = this.SHIP_SPEED;
        }
        if (Nakama.keyboard.isDown(this.configs.left)) {
            this.sprite.body.velocity.x = -this.SHIP_SPEED;
        } else if (Nakama.keyboard.isDown(this.configs.right)) {
            this.sprite.body.velocity.x = this.SHIP_SPEED;
        }
        if (Nakama.keyboard.isDown(this.configs.fire)) {
            this.tryFire();
        }
        this.timeSinceLastFire += Nakama.game.time.physicsElapsed;
    }

    tryFire() {
        if (this.timeSinceLastFire >= this.configs.cooldown) {
            this.fire();
            this.timeSinceLastFire = 0
        }

    }

    fire() {
        new BulletController(
            this.sprite.position.x,
            this.sprite.position.y,
            new Phaser.Point(0, -1),
            'BulletType1.png'
        );
    }
}
