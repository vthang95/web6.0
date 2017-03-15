class BulletController {
    constructor(x, y, direction, spriteName) {
        this.sprite = Nakama.bulletGroup.create(x, y, 'assets', spriteName);
        this.sprite.body.velocity = direction.setMagnitude(BulletController.BULLET_SPEED);
        this.sprite.body.checkWorldBounds = true;
        this.sprite.body.outOfBoundsKill = true;
        this.sprite.anchor = new Phaser.Point(0.5, 0.5);
    }

    update() {

    }

}

BulletController.BULLET_SPEED = 1500;
