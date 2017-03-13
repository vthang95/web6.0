class ShipController {
    constructor(x, y, spriteName, configs) {
        this.sprite = Nakama.game.add.sprite(x, y, 'assets', spriteName);
        this.configs = configs;
        Nakama.game.physics.arcade.enable(this.sprite);
        this.sprite.body.collideWorldBounds = true;
        this.SHIP_SPEED = 400;
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
    }
}
