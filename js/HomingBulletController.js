class HomingBulletController extends BulletController {
    constructor(position, direction, bulletSpeed, angle) {
        super(position, direction, 'BulletType1Upgraded.png', Nakama.playerBulletGroup, bulletSpeed, angle);
        Nakama.homingBulletControllers.push(this);
        this.sprite.events.onKilled.add(this.remove, this);
        this.sprite.anchor.setTo(0.5, 0.5);
        this.sprite.damage = 2;
    }

    remove() {
        Nakama.homingBulletControllers.splice(Nakama.homingBulletControllers.indexOf(this), 1);
    }

    update() {
        if (!this.sprite.alive) return;

        this.target = Nakama.enemyGroup.getFirstAlive();

        if (!this.target || !this.target.alive) return;

        this.sprite.body.velocity = Phaser.Point.subtract(
            this.target.position,
            this.sprite.position
        ).setMagnitude(HomingBulletController.BULLET_SPEED);

        this.sprite.rotation = Nakama.game.physics.arcade.angleBetween(this.sprite, this.target) + Math.PI / 2;

    }

    render() {
        // Nakama.game.debug.spriteInfo(this.sprite.damage, 32, 100);
        // Nakama.game.debug.spriteInfo(this.target, 32, 100);
    }
}

HomingBulletController.BULLET_SPEED = 300;
