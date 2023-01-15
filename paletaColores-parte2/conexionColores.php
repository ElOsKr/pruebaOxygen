<?php
    class conexionColores{
        private $conn=null;
        public function __construct(){
            $dsn="mysql:host=localhost;charset=utf8;dbname=colores";
            try{
                $this->conn=new PDO($dsn,'root','');
            }catch(PDOException $e){
                die("Error". $e->getMessage()."<br>");
            }
        }

        public function __destruct(){
            $this->conn=null;
        }

        public function insertarColor($id_color,$nombrePaleta,$color1,$color2,$color3,$color4,$color5){
            $datos=array(':id_color'=>$id_color,':nombrePaleta'=>$nombrePaleta,':color1'=>$color1,':color2'=>$color2,':color3'=>$color3,':color4'=>$color4,':color5'=>$color5);
            $sql='INSERT INTO datosColores(id_paleta,nombre_paleta,color1,color2,color3,color4,color5)
                    VALUES(:id_color,:nombrePaleta,:color1,:color2,:color3,:color4,:color5)';
            $q=$this->conn->prepare($sql);
            return $q->execute($datos);        
        }

        public function borrarColor($id_color){
            $datos=array(':id_color'=>$id_color);
            $sql='DELETE FROM datosColores where id_paleta=:id_color';
            $q=$this->conn->prepare($sql);
            return $q->execute($datos);
        }

        public function mostrarPaletas(){
            $sql='SELECT * FROM datosColores';
            $q=$this->conn->query($sql);
            return $q;
        }
    }


    if(isset($_POST['guardado'])){
        $conexion=new conexionColores();
        $datosPaleta=json_decode($_POST['guardado']);
        echo $datosPaleta;
        for ($i=0; $i < count($datosPaleta) ; $i++) { 
            $colores=[];
            $cadenaId=explode('-',$datosPaleta[$i][0]);
            for ($j=0; $j < count($datosPaleta[$i][1]); $j++) { 
                array_push($colores,"data-".$datosPaleta[$i][1][$j]);
            }
            $conexion->insertarColor($cadenaId[0],$cadenaId[1],$colores[0],$colores[1],$colores[2],$colores[3],$colores[4]);

        }
    }

    if(isset($_POST['mostrar'])){
        $conexion=new conexionColores();
        $paletas=[];
        foreach($conexion->mostrarPaletas() as $paleta){
            $datosPaleta=[];
            $cadenaId=$paleta['id_paleta'].'-'.$paleta['nombre_paleta'];
            array_push($datosPaleta,$cadenaId);
            $colores=[trim($paleta["color1"],"data-"),trim($paleta["color2"],"data-"),trim($paleta["color3"],"data-"),trim($paleta["color4"],"data-"),trim($paleta["color5"],"data-")];
            array_push($datosPaleta,$colores);
            array_push($paletas,$datosPaleta);
        }
        echo json_encode($paletas);
    }
    
    if(isset($_POST['borrar'])){
        $conexion=new conexionColores();
        $cadenaId=explode('-',json_decode($_POST['borrar']));
        $conexion->borrarColor($cadenaId[0]);
    }
?>