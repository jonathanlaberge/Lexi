<?php
namespace App\Model;

class Fiche
{
    public $idFiche;
    public $idCategorie;
    public $idMaitresseCreatrice;

    public $titre;
    public $dateCreation;

    //public $listeEleve;
	public $listeQuestion;

    
	function __construct()
	{
	}

	public function __set($property, $value)  
	{  
		if (property_exists($this, $property))
		{  
			$this->$property = $value;  
		}  
	}

	public function __get($property)  
	{  
		if (property_exists($this, $property))
		{  
			return $this->$property;  
		}  
	}
 }

