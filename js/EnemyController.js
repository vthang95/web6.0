class EnemyController {
    constructor(x, y, spriteName, configs) {
        this.sprite = Nakama.game.add.sprite(
            x,
            y,
            'assets',
            spriteName
        );
        this.configs = configs;
    }

    checkTrajectory() {
        var horizontal = () => {
            this.sprite.position.x += this.configs.velocity.x
            if (this.sprite.position.x > this.configs.maxX ||this.sprite.position.x < this.configs.minX) {
                this.configs.velocity.x = -this.configs.velocity.x;
            }
        };

        var zigzag = () => {
            this.sprite.position.x += this.configs.velocity.x;
            this.sprite.position.y += this.configs.velocity.y;
            if (this.sprite.position.x > this.configs.maxX || this.sprite.position.x < this.configs.minX) {
                this.configs.velocity.x = -this.configs.velocity.x;
            }
            if (this.sprite.position.y > this.configs.maxY || this.sprite.position.y < this.configs.minY) {
                this.configs.velocity.y = -this.configs.velocity.y;
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
