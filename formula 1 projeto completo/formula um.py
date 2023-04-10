

import os
import sys
import math
import random
import pygame
import neat
import pickle


radar_angles = [0, 45, 90, 135, 180]

speed = 7
rotation_speed = 8
angle = 270


x, y = 706, 759

pygame.init()
pygame.font.init()

screen = pygame.display.set_mode((1200, 1000))
pygame.display.set_caption("whatever")


background_image = pygame.image.load("C:/Users/bruno/OneDrive/Área de Trabalho/Nova pasta (2)/map.png")
background_image = pygame.transform.scale(background_image, (1200, 1000))
clock = pygame.time.Clock()


class Carro:
    def __init__(self, x, y, angle, car_number, radar_angles, genome, config):
        self.x = x
        self.y = y
        self.angle = angle
        self.image = pygame.image.load(f"C:/Users/bruno/OneDrive/Área de Trabalho/Nova pasta (2)/imagens/{car_number}.png")
        self.image = pygame.transform.scale(self.image, (35, 60))
        self.radar_angles = radar_angles
        self.genome = genome
        self.distance_travelled = 0
        self.fitness = 0
        self.net = neat.nn.FeedForwardNetwork.create(genome, config)
        self.stopped = False
        self.start_time = pygame.time.get_ticks()
        self.speed = 4
        self.max_speed = 15
        self.acceleration = 0.3
        self.deceleration = 0.5
        self.draw_collision_points = True
        self.passed_green_circle = False

    def collision(self):
        length = 40
        collision_point_right = [int(self.x + math.cos(math.radians(self.angle + 18)) * length),
                                 int(self.y - math.sin(math.radians(self.angle + 18)) * length)]
        collision_point_left = [int(self.x + math.cos(math.radians(self.angle - 18)) * length),
                                int(self.y - math.sin(math.radians(self.angle - 18)) * length)]


        if (0 <= collision_point_right[0] < background_image.get_width() and
            0 <= collision_point_right[1] < background_image.get_height() and
            0 <= collision_point_left[0] < background_image.get_width() and
            0 <= collision_point_left[1] < background_image.get_height()):


            if background_image.get_at(collision_point_right) == (2, 105, 31, 255) \
                    or background_image.get_at(collision_point_left) == (2, 105, 31, 255):
                self.stopped = True


        if self.draw_collision_points:
            pygame.draw.circle(screen, (0, 255, 255, 0), collision_point_right, 4)
            pygame.draw.circle(screen, (0, 255, 255, 0), collision_point_left, 4)

    def check_radar(self, degree, map):
        len = 0
        x2 = int(self.x + math.cos(math.radians(360 - (self.angle + degree))) * len)
        y2 = int(self.y + math.sin(math.radians(360 - (self.angle + degree))) * len)

        while len < 200:
            if (0 <= x2 < map.get_width() and 0 <= y2 < map.get_height()):
                if map.get_at((x2, y2)) == (0, 0, 0, 255):
                    break
            else:
                break

            len = len + 1
            x2 = int(self.x + math.cos(math.radians(360 - (self.angle + degree))) * len)
            y2 = int(self.y + math.sin(math.radians(360 - (self.angle + degree))) * len)

        dist = int(math.sqrt(math.pow(x2 - self.x, 2) + math.pow(y2 - self.y, 2)))
        return [(x2, y2), dist]

    def update(self):
        radars = []
        for radar_angle in self.radar_angles:
            radar_data = self.check_radar(radar_angle, background_image)
            radars.append(radar_data[1])

        output = self.net.activate(radars)

        if output[0] > 0.5:
            self.speed += self.acceleration
            self.speed = min(self.speed, self.max_speed)
        elif output[1] > 0.5:
            self.speed -= self.deceleration
            self.speed = max(self.speed, 4)

        if output[2] > 0.5:
            self.angle += rotation_speed

        if output[3] > 0.5:
            self.angle -= rotation_speed

        radians = math.radians(self.angle)
        vertical = math.cos(radians) * self.speed
        horizontal = math.sin(radians) * self.speed

        self.x -= horizontal
        self.y -= vertical
        self.distance_travelled += self.speed
        elapsed_time = pygame.time.get_ticks() - self.start_time
        time_penalty = elapsed_time / 1000
        self.genome.fitness = max(self.distance_travelled - time_penalty, 0)
        self.collision()
        distance_to_green_circle = math.sqrt((self.x - 448) ** 2 + (self.y - 355) ** 2)
        if distance_to_green_circle <= 30:
            self.passed_green_circle = True

        if 723 <= self.y <= 803 and self.x == 463 and self.passed_green_circle:
            self.genome.fitness += 4000  # Prêmio adicional

def main(genomes, config):
    cars = []
    for genome_id, genome in genomes:
        genome.fitness = 0
        random_car_number = random.randint(1, 26)
        cars.append(Carro(x, y, angle, random_car_number, radar_angles, genome, config)) 

    start_time = pygame.time.get_ticks()

    while True:
        current_time = pygame.time.get_ticks()  
        if current_time - start_time > 50000:  
            break

        clock.tick(0)
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()

        for car in cars:
            car.update()
            car.draw_collision_points = True
            car.genome.fitness = car.distance_travelled


            pixel_color = background_image.get_at((int(car.x), int(car.y)))
            if pixel_color == (0, 0, 0):
                cars.remove(car)


        screen.blit(background_image, (0, 0))

        pygame.draw.line(screen, (0, 0, 255), (463, 723), (463, 803), 5)
    

        pygame.draw.circle(screen, (0, 255, 0), (448, 355), 30)


        for car in cars:
            rotated_car = pygame.transform.rotate(car.image, car.angle)
            rect = rotated_car.get_rect()
            rect.center = (car.x, car.y)
            screen.blit(rotated_car, rect)


        if len(cars) == 0:
            break


        all_cars_stopped = all(car.stopped for car in cars)
        if len(cars) == 0 or all_cars_stopped:
            break


        my_font = pygame.font.SysFont('Comic Sans MS', 20)
        fps_text = "FPS: " + str(round(clock.get_fps()))
        fps_surface = my_font.render(fps_text, False, (23, 145, 123))
        screen.blit(fps_surface, (10, 40))

        pygame.display.update()

    return cars

def save_best_genome(best_genome, file_name="Melhor_carro7.pkl"):
    with open(file_name, "wb") as f:
        pickle.dump(best_genome, f)

def load_best_genome(file_name="Melhor_carro7.pkl"):
    with open(file_name, "rb") as f:
        best_genome = pickle.load(f)
    return best_genome

def play_best_cars(best_genomes, config):
    cars = [Carro(x, y, angle, i+1, radar_angles, genome, config) for i, genome in enumerate(best_genomes)]
    
    while True:
        clock.tick(60)
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                sys.exit()

        for car in cars:
            car.update()
            car.draw_collision_points = True


        screen.blit(background_image, (0, 0))


        for car in cars:
            rotated_car = pygame.transform.rotate(car.image, car.angle)
            rect = rotated_car.get_rect()
            rect.center = (car.x, car.y)
            screen.blit(rotated_car, rect)


        my_font = pygame.font.SysFont('Comic Sans MS', 20)
        fps_text = "FPS: " + str(round(clock.get_fps()))
        fps_surface = my_font.render(fps_text, False, (23, 145, 123))
        screen.blit(fps_surface, (10, 40))

        pygame.display.update()

        pygame.display.update()

if __name__ == "__main__":
    play_trained_cars = True  # Mude para False se quiser treinar a rede neural

    local_dir = os.path.dirname(__file__)
    config_path = os.path.join(local_dir, 'config.txt')
    config = neat.config.Config(neat.DefaultGenome, neat.DefaultReproduction,
                                 neat.DefaultSpeciesSet, neat.DefaultStagnation,
                                 config_path)

    if play_trained_cars:
        best_genomes = [load_best_genome(f"Melhor_carro{i}.pkl") for i in range(1, 8)]
        play_best_cars(best_genomes, config)
    else:
        p = neat.Population(config)
        p.add_reporter(neat.StdOutReporter(True))
        stats = neat.StatisticsReporter()
        p.add_reporter(stats)
        best_genome = None
        best_fitness = -1

        for i in range(5):
            cars = p.run(main, 1)
            gen_text = "Generation: {}".format(p.generation)
            print(gen_text)


            current_best_genome = max(p.population.values(), key=lambda x: x.fitness if x.fitness is not None else -math.inf)

            if current_best_genome.fitness > best_fitness:
                best_genome = current_best_genome
                best_fitness = current_best_genome.fitness


        with open('Melhor_carro7.pkl', 'wb') as output:
            pickle.dump(best_genome, output, 1)


        best_genome = load_best_genome()
        play_best_cars([best_genome], config)