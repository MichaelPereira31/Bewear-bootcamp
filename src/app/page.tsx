import { desc } from "drizzle-orm";
import Image from "next/image";

import CategorySelector from "@/components/common/category-selector";
import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import ProductList from "@/components/common/product-list";
import { db } from "@/db";
import { productTable } from "@/db/schema";

const Home = async () => {
  const products = await db.query.productTable.findMany({
    with: {
      variants: true,
    },
  });
  const newlyCreatedProducts = await db.query.productTable.findMany({
    orderBy: [desc(productTable.createdAt)],
    with: {
      variants: true,
    },
  });
  const categories = await db.query.categoryTable.findMany({});

  return (
    <>
      <Header />
      <div className="space-y-8 md:space-y-12">
        {/* Banner Principal com animação de entrada */}
        <div className="px-5">
          <div className="hover:shadow-3xl relative overflow-hidden rounded-2xl shadow-2xl md:rounded-3xl">
            <Image
              src="/imagens/banner-01.png"
              alt="Leve uma vida com estilo"
              height={0}
              width={0}
              sizes="100vw"
              className="h-auto w-full transform object-cover transition-transform duration-700 hover:scale-105 lg:hidden"
              priority
            />
            <Image
              src="/imagens/banner-inicial-desktop.png"
              alt="Leve uma vida com estilo"
              height={0}
              width={0}
              sizes="100vw"
              className="hidden h-auto w-full object-cover lg:block"
              priority
            />
            {/* Overlay gradiente para melhor contraste */}
            {/* <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent opacity-60" /> */}
          </div>
        </div>

        {/* Seção Mais Vendidos com título estilizado */}
        <div className="animate-slide-up">
          <div className="px-5">
            <ProductList products={products} title="Mais Vendidos" />
          </div>
        </div>

        {/* Category Selector com animação */}
        <div className="animate-slide-up px-5 delay-100">
          <div className="from-background to-secondary/10 rounded-2xl bg-gradient-to-r p-6 shadow-lg">
            <h3 className="text-foreground mb-6 text-center text-2xl font-bold">
              Explore por categoria
            </h3>
            <CategorySelector categories={categories} />
          </div>
        </div>

        {/* Segundo Banner com efeito hover */}
        <div className="px-5">
          <div className="group relative cursor-pointer overflow-hidden">
            <Image
              src="/imagens/banner-02.png"
              alt="Leve uma vida com estilo"
              height={0}
              width={0}
              sizes="100vw"
              className="h-auto w-full transform object-cover transition-transform duration-700 hover:scale-105 lg:hidden"
            />
            <Image
              src="/imagens/banner-segundo-desktop.png"
              alt="Leve uma vida com estilo"
              height={0}
              width={0}
              sizes="100vw"
              className="hidden h-auto w-full object-cover lg:block"
              priority
            />
            {/* Overlay com efeito hover */}
            {/* Texto flutuante */}
            <div className="absolute bottom-8 left-8 translate-y-4 transform text-white transition-transform duration-500 group-hover:translate-y-0">
              <p className="text-2xl font-bold drop-shadow-lg md:text-3xl">
                Novas Coleções
              </p>
              <p className="text-lg opacity-90">
                Descubra as últimas tendências
              </p>
            </div>
          </div>
        </div>

        {/* Seção Novos Produtos */}
        <div className="animate-slide-up delay-300">
          <div className="px-5">
            <ProductList
              products={newlyCreatedProducts}
              title="Novos produtos"
            />
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
};

export default Home;
