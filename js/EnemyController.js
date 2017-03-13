class EnemyController {
    constructor(x, y, spriteName, configs) {
        this.sprite = Nakama.game.add.sprite(
            x,
            y,
            'assets',
            spriteName
        );
        this.configs = configs;
        Nakama.game.physics.arcade.enable(this.sprite);
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
        }

        if (this.configs.trajectory === 'horizontal') {
            this.trajectory = horizontal;
        }
        if (this.configs.trajectory === 'zigzag') {
            this.trajectory = zigzag;
        }
    }

    update() {
        this.checkTrajectory();
        this.trajectory();
    }
}
