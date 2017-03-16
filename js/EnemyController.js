class EnemyController {
    constructor(x, y, spriteName, configs) {
        this.sprite = Nakama.enemyGroup.create(
            x,
            y,
            'assets',
            spriteName
        );
        this.configs = configs;
        this.sprite.health = this.configs.health;
        this.timeSinceLastFire = 0;
        this.sprite.anchor.setTo(0.5, 0.5);
        this.checkTrajectory();
    }

    checkTrajectory() {
        var horizontal = () => {
            if (this.sprite.position.x < this.configs.minX) {
                this.sprite.body.velocity.x = this.configs.velocity.x;
            }
            if (this.sprite.position.x > this.configs.maxX) {
                this.sprite.body.velocity.x = - this.configs.velocity.x;
            }
            if (this.sprite.body.velocity.x == 0) {
                this.sprite.body.velocity.x = this.configs.velocity.x;
            }
        };

        var zigzag = () => {
            if (this.sprite.position.x > this.configs.maxX) {
                this.sprite.body.velocity.x = -this.configs.velocity.x;
            }
            if (this.sprite.position.x < this.configs.minX) {
                this.sprite.body.velocity.x = this.configs.velocity.x;
            }
            if (this.sprite.position.y > this.configs.maxY) {
                this.sprite.body.velocity.y = -this.configs.velocity.y;
            }
            if (this.sprite.position.y < this.configs.minY) {
                this.sprite.body.velocity.y = this.configs.velocity.y;
            }
            if (this.sprite.body.velocity.x === 0 && this.sprite.body.velocity.y === 0) {
                this.sprite.body.velocity.x = this.configs.velocity.x;
                this.sprite.body.velocity.y = this.configs.velocity.y;
            }
        };

        if (this.configs.trajectory === 'horizontal') {
            this.trajectory = horizontal;
        }
        if (this.configs.trajectory === 'zigzag') {
            this.trajectory = zigzag;
        }
    }

    isShutDown() {

    }

    update() {
        this.trajectory();
        this.timeSinceLastFire += Nakama.game.time.physicsElapsed;
        if (this.timeSinceLastFire > this.configs.cooldown + EnemyController.EXTRA_COOLDOWN_TIME) {
            this.fire();
            this.timeSinceLastFire = 0;
        }
    }

    fire() {
        if (!this.sprite.alive) return;

        new EnemyBulletController(
            this.sprite.position,
            new Phaser.Point(0, 1),
            Nakama.configs.enemy.bulletSpeed,
            Nakama.configs.enemy.bulletAngle
        );
    }
}

EnemyController.EXTRA_COOLDOWN_TIME = 1;
