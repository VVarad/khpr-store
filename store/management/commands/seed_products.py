from django.core.management.base import BaseCommand
from store.models import Category, Product, ProductSize

class Command(BaseCommand):
    help = 'Seeds the database with sample products'

    def handle(self, *args, **kwargs):
        category, created = Category.objects.get_or_create(
            slug="t-shirts",
            defaults={"name": "T-Shirts"}
        )

        product1_slug = "the-victory"
        if not Product.objects.filter(slug=product1_slug).exists():
            product1 = Product.objects.create(
                name="The Victory",
                slug=product1_slug,
                category=category,
                price=699.00,
                is_active=True,
                description=(
                    "An oversized drop-shoulder tee in washed black. "
                    "Large back print, minimal KHPR chest logo. "
                    "100% cotton, pre-shrunk, 220 GSM."
                ),
                story=(
                    "Kolhapur's very name is born from this moment. "
                    "Kolhasur, the demon king who terrorised the land, was granted a boon — "
                    "that he could only be slain by a woman. "
                    "Amba Bai, the divine mother, rose to meet him. "
                    "The battle was fierce, but her victory was absolute. "
                    "Kolhasur's final wish was that the city bear his name, "
                    "so that he would be remembered through her glory. "
                    "Kolha-pur. The city of Kolha. Every time you say its name, "
                    "you're retelling this story."
                ),
                front_image="/designs/D1_M.png",
                back_image="/designs/D1_F.png",
                detail_image="/designs/D1_M.png"
            )
            sizes1 = [
                { "size": "S",   "stock": 10 },
                { "size": "M",   "stock": 15 },
                { "size": "L",   "stock": 15 },
                { "size": "XL",  "stock": 8  },
                { "size": "XXL", "stock": 2  },
            ]
            for s in sizes1:
                ProductSize.objects.create(product=product1, size=s['size'], stock=s['stock'])
            self.stdout.write(self.style.SUCCESS('Successfully seeded "The Victory"'))
        else:
            self.stdout.write(self.style.WARNING('Product "The Victory" already exists. Skipping.'))

        product2_slug = "the-throne"
        if not Product.objects.filter(slug=product2_slug).exists():
            product2 = Product.objects.create(
                name="The Throne",
                slug=product2_slug,
                category=category,
                price=699.00,
                is_active=True,
                description=(
                    "An oversized drop-shoulder tee in washed black. "
                    "Large back print, minimal KHPR chest logo. "
                    "100% cotton, pre-shrunk, 220 GSM."
                ),
                story=(
                    "When Chhatrapati Rajaram Maharaj passed in 1700, "
                    "the Mughal empire assumed Kolhapur would fall. "
                    "Instead, his widow Tarabai picked up the sword. "
                    "She commanded the Maratha army at a time when no one expected her to. "
                    "She didn't just defend Kolhapur — she kept the entire Maratha resistance alive "
                    "for years against Aurangzeb's forces. "
                    "The throne was never empty. "
                    "She made sure of it."
                ),
                front_image="/designs/D2_M.png",
                back_image="/designs/D2_F.png",
                detail_image="/designs/D2_M.png"
            )
            sizes2 = [
                { "size": "S",   "stock": 8  },
                { "size": "M",   "stock": 12 },
                { "size": "L",   "stock": 12 },
                { "size": "XL",  "stock": 10 },
                { "size": "XXL", "stock": 3  },
            ]
            for s in sizes2:
                ProductSize.objects.create(product=product2, size=s['size'], stock=s['stock'])
            self.stdout.write(self.style.SUCCESS('Successfully seeded "The Throne"'))
        else:
            self.stdout.write(self.style.WARNING('Product "The Throne" already exists. Skipping.'))
