<?php

namespace Database\Seeders;

use App\Models\Products;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Seed 50 productos de tecnología variados.
     */
    public function run(): void
    {
        $products = [
            [
                'name' => 'MacBook Pro 16" M4 Max',
                'features' => 'Chip M4 Max, 48GB RAM, 1TB SSD, pantalla Liquid Retina XDR, batería 22h',
                'price' => 3499.99,
                'images' => ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800'],
            ],
            [
                'name' => 'iPhone 17 Pro Max',
                'features' => 'Chip A19 Pro, 8GB RAM, cámara 48MP, pantalla Super Retina XDR 6.9", titanio',
                'price' => 1399.99,
                'images' => ['https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800'],
            ],
            [
                'name' => 'Samsung Galaxy S26 Ultra',
                'features' => 'Snapdragon 8 Gen 5, 16GB RAM, cámara 200MP, S Pen integrado, 5000mAh',
                'price' => 1299.99,
                'images' => ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800'],
            ],
            [
                'name' => 'Sony WH-1000XM6',
                'features' => 'Cancelación de ruido adaptativa, 40h batería, LDAC, Hi-Res Audio, multipoint',
                'price' => 399.99,
                'images' => ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'],
            ],
            [
                'name' => 'ASUS ROG Strix G18',
                'features' => 'Intel i9-14900HX, RTX 4090, 64GB DDR5, 2TB NVMe, pantalla 240Hz QHD+',
                'price' => 3299.99,
                'images' => ['https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800'],
            ],
            [
                'name' => 'iPad Pro 13" M4',
                'features' => 'Chip M4, pantalla OLED Ultra Retina XDR, 16GB RAM, 1TB, Apple Pencil Pro',
                'price' => 1799.99,
                'images' => ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800'],
            ],
            [
                'name' => 'Dell XPS 15',
                'features' => 'Intel Core Ultra 9, 32GB RAM, 1TB SSD, pantalla OLED 3.5K, Thunderbolt 4',
                'price' => 2199.99,
                'images' => ['https://images.unsplash.com/photo-1593642632823-2f9fcc82f7c1?w=800'],
            ],
            [
                'name' => 'AirPods Pro 3',
                'features' => 'Chip H3, cancelación activa de ruido, audio espacial, USB-C, IP54',
                'price' => 279.99,
                'images' => ['https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=800'],
            ],
            [
                'name' => 'Nintendo Switch 2',
                'features' => 'Pantalla LCD 8", Joy-Con magnéticos, dock 4K, 256GB almacenamiento',
                'price' => 449.99,
                'images' => ['https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800'],
            ],
            [
                'name' => 'PlayStation 5 Pro',
                'features' => 'GPU mejorada 45% más rápida, 2TB SSD, ray tracing avanzado, Wi-Fi 7',
                'price' => 699.99,
                'images' => ['https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800'],
            ],
            [
                'name' => 'Samsung Odyssey G9 49"',
                'features' => 'Monitor curvo DQHD 5120x1440, 240Hz, Mini LED, HDR 2000, 1ms',
                'price' => 1799.99,
                'images' => ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800'],
            ],
            [
                'name' => 'Logitech MX Master 4',
                'features' => 'Sensor 8K DPI, scroll MagSpeed, USB-C, Bluetooth, 70 días batería',
                'price' => 109.99,
                'images' => ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800'],
            ],
            [
                'name' => 'Canon EOS R6 Mark III',
                'features' => 'Sensor Full Frame 28MP, grabación 6K, IBIS 8 pasos, Dual Pixel AF II',
                'price' => 2799.99,
                'images' => ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800'],
            ],
            [
                'name' => 'DJI Mavic 4 Pro',
                'features' => 'Sensor Hasselblad 1", grabación 5.1K, vuelo 46 min, detección omnidireccional',
                'price' => 2199.99,
                'images' => ['https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800'],
            ],
            [
                'name' => 'Apple Watch Ultra 3',
                'features' => 'Pantalla 2000 nits, GPS doble frecuencia, 72h batería, titanio grado 5',
                'price' => 899.99,
                'images' => ['https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800'],
            ],
            [
                'name' => 'Bose SoundLink Max',
                'features' => 'Bluetooth 5.4, 20h batería, IP67, sonido 360°, carga rápida USB-C',
                'price' => 349.99,
                'images' => ['https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800'],
            ],
            [
                'name' => 'Razer BlackWidow V5 Pro',
                'features' => 'Switches ópticos Gen-4, RGB Chroma, reposamuñecas magnético, PBT keycaps',
                'price' => 229.99,
                'images' => ['https://images.unsplash.com/photo-1541140532154-b024d1b15e38?w=800'],
            ],
            [
                'name' => 'LG OLED C4 65"',
                'features' => 'OLED evo 4K, procesador α9 Gen7, Dolby Vision IQ, 4 HDMI 2.1, 144Hz',
                'price' => 1799.99,
                'images' => ['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800'],
            ],
            [
                'name' => 'Google Pixel 9 Pro',
                'features' => 'Tensor G4, 16GB RAM, cámara 50MP, 7 años actualizaciones, Gemini Nano',
                'price' => 1079.99,
                'images' => ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800'],
            ],
            [
                'name' => 'Dyson Zone i1',
                'features' => 'Purificación de aire personal, ANC avanzado, Hi-Fi audio, 50h batería',
                'price' => 699.99,
                'images' => ['https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800'],
            ],
            [
                'name' => 'Meta Quest 4',
                'features' => 'Snapdragon XR3, pantalla 4K por ojo, seguimiento ocular, 3h batería',
                'price' => 499.99,
                'images' => ['https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?w=800'],
            ],
            [
                'name' => 'Lenovo ThinkPad X1 Carbon Gen 12',
                'features' => 'Intel Core Ultra 7, 32GB RAM, 1TB SSD, pantalla 2.8K OLED, 1.08kg',
                'price' => 1849.99,
                'images' => ['https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800'],
            ],
            [
                'name' => 'Samsung Galaxy Tab S10 Ultra',
                'features' => 'Snapdragon 8 Gen 4, 16GB RAM, pantalla 14.6" AMOLED 120Hz, S Pen',
                'price' => 1199.99,
                'images' => ['https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800'],
            ],
            [
                'name' => 'Xbox Series X 2TB',
                'features' => '2TB SSD, soporte 8K, ray tracing hardware, Game Pass Ultimate incluido',
                'price' => 599.99,
                'images' => ['https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=800'],
            ],
            [
                'name' => 'GoPro Hero 13 Black',
                'features' => 'Sensor 1/1.7", grabación 5.3K 60fps, HyperSmooth 7.0, GPS, sumergible 10m',
                'price' => 449.99,
                'images' => ['https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800'],
            ],
            [
                'name' => 'Corsair Vengeance DDR5 64GB',
                'features' => 'DDR5-6400, CL32, XMP 3.0, Intel & AMD compatible, RGB iCUE',
                'price' => 189.99,
                'images' => ['https://images.unsplash.com/photo-1562976540-1502c2145186?w=800'],
            ],
            [
                'name' => 'NVIDIA GeForce RTX 5090',
                'features' => '32GB GDDR7, DLSS 4, ray tracing 4ta gen, 21760 CUDA cores, PCIe 5.0',
                'price' => 1999.99,
                'images' => ['https://images.unsplash.com/photo-1591488320449-011701bb6704?w=800'],
            ],
            [
                'name' => 'Samsung 990 Pro 4TB NVMe',
                'features' => 'PCIe 4.0, lectura 7450MB/s, escritura 6900MB/s, TLC V-NAND, cifrado AES-256',
                'price' => 349.99,
                'images' => ['https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800'],
            ],
            [
                'name' => 'Sonos Era 300',
                'features' => 'Audio espacial Dolby Atmos, 6 drivers, Wi-Fi 6, AirPlay 2, Trueplay',
                'price' => 449.99,
                'images' => ['https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800'],
            ],
            [
                'name' => 'Garmin Fenix 8 Solar',
                'features' => 'GPS multibanda, carga solar, mapas TopoActive, titanio, 37 días batería',
                'price' => 999.99,
                'images' => ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'],
            ],
            [
                'name' => 'Keychron Q1 Pro',
                'features' => 'Teclado mecánico 75%, hot-swap, Gateron Jupiter Brown, QMK/VIA, aluminio CNC',
                'price' => 199.99,
                'images' => ['https://images.unsplash.com/photo-1595225476474-87563907a212?w=800'],
            ],
            [
                'name' => 'TP-Link Deco BE85 (3-Pack)',
                'features' => 'Wi-Fi 7, Tri-Band BE22000, cobertura 750m², 10 Gbps, AI Mesh',
                'price' => 899.99,
                'images' => ['https://images.unsplash.com/photo-1606904825846-647eb07f5be2?w=800'],
            ],
            [
                'name' => 'Anker 737 Power Bank 25600mAh',
                'features' => '140W USB-C PD, pantalla digital, carga portátil 3 dispositivos, vuelo seguro',
                'price' => 149.99,
                'images' => ['https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=800'],
            ],
            [
                'name' => 'Secretlab Titan Evo 2026',
                'features' => 'Silla ergonómica, soporte lumbar 4D, reposabrazos CloudSwap, piel sintética',
                'price' => 549.99,
                'images' => ['https://images.unsplash.com/photo-1596079890744-c1a0462d0975?w=800'],
            ],
            [
                'name' => 'Rode Podcaster Pro',
                'features' => 'Micrófono dinámico USB-C/XLR, procesador APHEX, 24-bit/96kHz, pop filter',
                'price' => 299.99,
                'images' => ['https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=800'],
            ],
            [
                'name' => 'Elgato Stream Deck+',
                'features' => '8 teclas LCD, 4 diales táctiles, pantalla táctil, integración OBS/Twitch',
                'price' => 199.99,
                'images' => ['https://images.unsplash.com/photo-1625842268584-8f3296236ecb?w=800'],
            ],
            [
                'name' => 'Epson EcoTank ET-4850',
                'features' => 'Impresora multifunción, tinta continua, Wi-Fi, ADF, 2 años de tinta incluida',
                'price' => 549.99,
                'images' => ['https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800'],
            ],
            [
                'name' => 'Synology DS923+',
                'features' => 'NAS 4 bahías, AMD Ryzen R1600, 4GB DDR4, 2x M.2 NVMe, 2x 1GbE',
                'price' => 599.99,
                'images' => ['https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800'],
            ],
            [
                'name' => 'Steam Deck OLED 1TB',
                'features' => 'Pantalla OLED 7.4" HDR, APU AMD custom, 16GB RAM, Wi-Fi 6E, 12h batería',
                'price' => 649.99,
                'images' => ['https://images.unsplash.com/photo-1640955014216-75201056c829?w=800'],
            ],
            [
                'name' => 'Xiaomi 14 Ultra',
                'features' => 'Snapdragon 8 Gen 3, Leica Summilux quad cam, 1" sensor, 5300mAh, 90W carga',
                'price' => 1099.99,
                'images' => ['https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800'],
            ],
            [
                'name' => 'Jabra Elite 10 Gen 2',
                'features' => 'ANC adaptativo, Dolby Atmos, 36h batería total, Bluetooth 5.4, IP57',
                'price' => 249.99,
                'images' => ['https://images.unsplash.com/photo-1590658268037-6bf12f032f55?w=800'],
            ],
            [
                'name' => 'Samsung Galaxy Ring 2',
                'features' => 'Titanio grado 5, monitoreo sueño, frecuencia cardíaca, SpO2, 7 días batería',
                'price' => 349.99,
                'images' => ['https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800'],
            ],
            [
                'name' => 'Raspberry Pi 5 8GB Kit',
                'features' => 'BCM2712 quad-core 2.4GHz, 8GB RAM, case oficial, fuente 27W, microSD 128GB',
                'price' => 119.99,
                'images' => ['https://images.unsplash.com/photo-1629292921498-c80c37735ab4?w=800'],
            ],
            [
                'name' => 'BenQ ScreenBar Halo',
                'features' => 'Lámpara monitor LED, sensor de luz, control inalámbrico, retroiluminación',
                'price' => 179.99,
                'images' => ['https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=800'],
            ],
            [
                'name' => 'Logitech G Pro X Superlight 2',
                'features' => 'Mouse gaming 60g, sensor HERO 2, 32K DPI, Lightspeed wireless, 95h batería',
                'price' => 159.99,
                'images' => ['https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800'],
            ],
            [
                'name' => 'CalDigit TS4 Thunderbolt 4 Dock',
                'features' => '18 puertos, 98W PD, 2x TB4, 2.5GbE, DisplayPort 1.4, lector SD UHS-II',
                'price' => 399.99,
                'images' => ['https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?w=800'],
            ],
            [
                'name' => 'UGREEN Nexode 300W GaN',
                'features' => 'Cargador 5 puertos, 140W USB-C x2, GaN III, pantalla LED, plegable',
                'price' => 129.99,
                'images' => ['https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800'],
            ],
            [
                'name' => 'Herman Miller Embody Gaming',
                'features' => 'Silla ergonómica premium, soporte espinal, ajuste de presión, 12 años garantía',
                'price' => 1795.00,
                'images' => ['https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=800'],
            ],
            [
                'name' => 'Shure SM7dB',
                'features' => 'Micrófono dinámico, preamplificador integrado, patrón cardioide, XLR, anti-hum',
                'price' => 499.99,
                'images' => ['https://images.unsplash.com/photo-1598550476439-6847785fcea6?w=800'],
            ],
            [
                'name' => 'Oura Ring Gen 4',
                'features' => 'Seguimiento sueño, HRV, temperatura corporal, SpO2, titanio, 7 días batería',
                'price' => 399.99,
                'images' => ['https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800'],
            ],
        ];

        foreach ($products as $product) {
            Products::create($product);
        }

        $this->command->info('✅ 50 productos creados exitosamente.');
    }
}
