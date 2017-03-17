class BossController {
    constructor(x, y, spriteName, configs) {
        this.sprite = Nakama.enemyGroup.create(
            x,
            y,
            'assets',
            spriteName
        );

        this.configs = configs;
        this.damage = 5;
        this.sprite.anchor.setTo(0.5, 0.5);
        this.sprite.health = Nakama.configs.boss.health;

        this.sprite.timeSinceLastFire = 0;
        this.sprite.timeSinceLastJump = 0;
        this.sprite.timeSinceLastHeavyStrike = 0;
        this.sprite.timeSinceLastLaserStrike = 0;

        Nakama.bosses.push(this);
        this.sprite.events.onKilled.add(this.remove, this);

        this.healthBar = Nakama.game.add.sprite(x + 80, y - 60, 'assets', 'EnemyBulletType3.png');
        this.healthBar.anchor.setTo(0.5, 0.5);
    }

    remove() {
        Nakama.bosses.splice(Nakama.bosses.indexOf(this), 1);
    }

    move() {
        let random = Math.floor(Math.random() * 4 + 1);
        let speed = 150;
        switch (random) {
            case 1:
                Nakama.game.physics.arcade.moveToXY(this.sprite, 500, 140, speed);
                break;
            case 2:
                Nakama.game.physics.arcade.moveToXY(this.sprite, 500, 300, speed);
                break;
            case 3:
                Nakama.game.physics.arcade.moveToXY(this.sprite, 140, 300, speed);
                break;
            case 4:
                Nakama.game.physics.arcade.moveToXY(this.sprite, 140, 140, speed);
                break;
            default:
                return;
        }
    }


    createLaserBullet(direction) {
        new BulletController(
            this.sprite.position,
            direction,
            'EnemyBulletType3Origin.png',
            Nakama.enemyBulletGroup,
            Nakama.configs.boss.laserBulletSpeed,
            Math.atan(direction.x / -direction.y) * 180 / Math.PI
        );
    }

    laserStrike() {
        if (!this.sprite.alive) return;
        this.createLaserBullet(new Phaser.Point(0, 1));
        this.createLaserBullet(new Phaser.Point(-0.5, 1));
        this.createLaserBullet(new Phaser.Point(0.5, 1));
    }

    heavyStrike() {
        let quantity = 3;
        let delayRespawnTime = 500;
        let self = this;

        function strike(time) {
            for (let i = time; i >= 0; i--) {
                setTimeout(() => {
                    if (!self.sprite.alive) return;
                    new HomingBulletController(
                        self.sprite.position,
                        new Phaser.Point(0, -1),
                        Nakama.enemyHomingBulletGroup,
                        'EnemyBulletType1.png',
                        Nakama.configs.boss.homingBulletSpeed.heavyStrike
                    );
                }, (time - i) * delayRespawnTime);
            }
        }
        strike(quantity);
    }

    normalHomingFire() {
        if (!this.sprite.alive) return;
        new HomingBulletController(
            this.sprite.position,
            new Phaser.Point(0, -1),
            Nakama.enemyHomingBulletGroup,
            'EnemyBulletType2.png',
            Nakama.configs.enemy.bulletSpeed
        );
    }

    update() {
        if (!this.sprite.alive) return;

        this.healthBar.position.x = this.sprite.position.x + 90;
        this.healthBar.position.y = this.sprite.position.y;
        this.healthBar.scale.setTo(1, this.sprite.health / Nakama.configs.boss.health);

        this.sprite.timeSinceLastJump += Nakama.game.time.physicsElapsed;
        if (this.sprite.timeSinceLastJump > this.configs.cooldown + BossController.EXTRA_COOLDOWN_TIME) {
            this.move();
            this.sprite.timeSinceLastJump = 0;
        }

        if (Nakama.players.length === 0) return;

        this.sprite.timeSinceLastFire += Nakama.game.time.physicsElapsed;
        if (this.sprite.timeSinceLastFire > this.configs.cooldown + BossController.EXTRA_COOLDOWN_TIME) {
            this.normalHomingFire();
            this.sprite.timeSinceLastFire = 0;
        }

        this.sprite.timeSinceLastHeavyStrike += Nakama.game.time.physicsElapsed;
        if (this.sprite.timeSinceLastHeavyStrike > this.configs.cooldown + BossController.EXTRA_COOLDOWN_TIME * 8) {
            this.heavyStrike();
            this.sprite.timeSinceLastHeavyStrike = 0;
        }

        this.sprite.timeSinceLastLaserStrike += Nakama.game.time.physicsElapsed;
        if (this.sprite.timeSinceLastLaserStrike > this.configs.cooldown + BossController.EXTRA_COOLDOWN_TIME * 1) {
            this.laserStrike();
            this.sprite.timeSinceLastLaserStrike = 0;
        }

    }
}

BossController.EXTRA_COOLDOWN_TIME = 1;
