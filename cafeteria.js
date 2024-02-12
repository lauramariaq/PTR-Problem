class Semaphore {
    constructor(initialCount) {
      this.count = initialCount;
      this.waitingQueue = [];
    }
  
    async acquire() {
      if (this.count > 0) {
        this.count--;
      } else {
        await new Promise(resolve => this.waitingQueue.push(resolve));
      }
    }
  
    release() {
      if (this.waitingQueue.length > 0) {
        const nextResolve = this.waitingQueue.shift();
        nextResolve();
      } else {
        this.count++;
      }
    }
  }
  
  const capacity = 5; // Capacidad máxima de la cafetería
  const accessSemaphore = new Semaphore(6); // Semáforo binario para controlar el acceso a la cafetería
  const capacitySemaphore = new Semaphore(capacity); // Semáforo contador para controlar el número de personas dentro de la cafetería
  
  async function comprarCafe(estudiante) {
    await capacitySemaphore.acquire();
    console.log(`${estudiante} ha entrado a la cafetería.`);
    // Simulación de tiempo que lleva comprar café
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log(`${estudiante} ha comprado su café y salido de la cafetería.`);
    capacitySemaphore.release();
  }
  
  async function estudiante(entraCafeteria) {
    await accessSemaphore.acquire();
    if (capacitySemaphore.count > 0) {
      await comprarCafe(entraCafeteria);
    } else {
      console.log(`${entraCafeteria} no puede entrar, la cafetería está llena.`);
    }
    accessSemaphore.release();
  }
  
  // Simulación de estudiantes intentando entrar a la cafetería
  for (let i = 1; i <= 8; i++) {
    estudiante(`Estudiante ${i}`);
  }
  