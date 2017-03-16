class BulletController {
    constructor(position, direction, spriteName, physicsGroup, bulletSpeed, angle) {
        this.sprite = physicsGroup.create(position.x, position.y, 'assets', spriteName);
        this.sprite.body.velocity = direction.setMagnitude(bulletSpeed);
        this.sprite.body.checkWorldBounds = true;
        this.sprite.body.outOfBoundsKill = true;
        this.sprite.angle = angle;
        this.sprite.anchor = new Phaser.Point(0.5, 0.5);
        this.sprite.damage = 1;
    }
}
